import logging
from django.db import transaction
from django.utils import timezone
from django.conf import settings
from apps.orders.models import Order, OrderStatusHistory
from apps.catalog.models import ProductSize
from apps.loyalty.models import LoyaltyLedger
from apps.promos.models import PromoCode
from apps.payments.models import Payment

logger = logging.getLogger(__name__)

def process_successful_payment(order, payment, receipt_number, provider_name='MPESA'):
    """
    Atomic settlement executed upon confirmed payment:
    1. Mark Order & Payment as PAID / SUCCESS
    2. Store receipt number
    3. Convert reserved stock into permanent decrement
    4. Increment promo used_count if promo was applied
    5. Award loyalty points (1 point per KES 100 spent)
    6. Record OrderStatusHistory
    7. Enqueue SMS and Email notifications via transaction.on_commit
    """
    with transaction.atomic():
        # Ensure fresh locked order row
        locked_order = Order.objects.select_for_update().get(id=order.id)
        if locked_order.payment_status == Order.PaymentStatus.SUCCESS:
            logger.info("Order %s already processed as PAID.", locked_order.order_number)
            return locked_order

        locked_payment = Payment.objects.select_for_update().get(id=payment.id)

        # 1. Update statuses
        locked_order.status = Order.Status.PAID
        locked_order.payment_status = Order.PaymentStatus.SUCCESS
        locked_order.mpesa_receipt_number = receipt_number
        locked_order.save()

        locked_payment.status = Payment.Status.SUCCESS
        if provider_name == 'MPESA':
            locked_payment.mpesa_receipt_number = receipt_number
        locked_payment.save()

        # 2. Convert reserved stock to permanent decrement
        for item in locked_order.items.select_related('product').all():
            product = item.product
            if product:
                size_obj = ProductSize.objects.select_for_update().filter(product=product, label=item.size_label).first()
                target_stock = size_obj if size_obj else product

                # Decrement both stock and reserved quantity
                target_stock.stock_quantity = max(0, target_stock.stock_quantity - item.quantity)
                target_stock.reserved_quantity = max(0, target_stock.reserved_quantity - item.quantity)
                target_stock.save()

        # 3. Increment promo usage
        if locked_order.promo_code:
            PromoCode.objects.filter(id=locked_order.promo_code.id).update(used_count=models.F('used_count') + 1)

        # 4. Award Loyalty Points
        if locked_order.user:
            earn_rate = getattr(settings, 'LOYALTY_EARN_RATE_KES', 100)
            earned_points = max(1, locked_order.total // earn_rate)
            LoyaltyLedger.record_transaction(
                user=locked_order.user,
                points=earned_points,
                transaction_type=LoyaltyLedger.TransactionType.EARNED,
                order=locked_order,
                description=f"Earned from Order {locked_order.order_number}"
            )

        # 5. Order Status History
        OrderStatusHistory.objects.create(
            order=locked_order,
            from_status=Order.Status.PENDING,
            to_status=Order.Status.PAID,
            notes=f"Payment received via {provider_name}. Ref: {receipt_number}"
        )

        # 6. Enqueue notifications via transaction.on_commit
        def trigger_notifications():
            try:
                from apps.notifications.services import (
                    send_payment_confirmation_sms_task,
                    send_order_receipt_email_task
                )
                send_payment_confirmation_sms_task(locked_order.id)
                send_order_receipt_email_task(locked_order.id)
            except Exception as e:
                logger.error("Failed to enqueue notifications for order %s: %s", locked_order.order_number, str(e))

        transaction.on_commit(trigger_notifications)

    return locked_order
