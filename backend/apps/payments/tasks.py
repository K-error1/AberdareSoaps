import logging
from django.utils import timezone
from apps.payments.models import Payment, WebhookEvent
from apps.orders.models import Order
from apps.payments.services import process_successful_payment

logger = logging.getLogger(__name__)

def process_mpesa_callback_task(payload):
    """
    Parses Daraja callback metadata and marks payment/order PAID
    """
    callback_data = payload.get('Body', {}).get('stkCallback', {})
    checkout_request_id = callback_data.get('CheckoutRequestID')
    result_code = callback_data.get('ResultCode')
    result_desc = callback_data.get('ResultDesc')

    payment = Payment.objects.filter(mpesa_checkout_request_id=checkout_request_id).first()
    if not payment:
        logger.error("No payment found matching CheckoutRequestID %s", checkout_request_id)
        return

    payment.raw_callback_payload = payload

    if result_code == 0:
        # Success
        items = callback_data.get('CallbackMetadata', {}).get('Item', [])
        receipt_number = ''
        amount = 0
        for item in items:
            name = item.get('Name')
            val = item.get('Value')
            if name == 'MpesaReceiptNumber':
                receipt_number = str(val)
            elif name == 'Amount':
                amount = int(val)

        logger.info("Daraja Success for Order %s: Receipt %s, Amount %s", payment.order.order_number, receipt_number, amount)
        process_successful_payment(payment.order, payment, receipt_number, provider_name='MPESA')
    else:
        # Failed or cancelled (1032 user cancelled, 1037 timeout, etc.)
        logger.warning("Daraja payment failed for Order %s: Code %s (%s)", payment.order.order_number, result_code, result_desc)
        payment.status = Payment.Status.FAILED if result_code != 1032 else Payment.Status.CANCELLED
        payment.save()

    # Update WebhookEvent status
    WebhookEvent.objects.filter(event_id=checkout_request_id).update(is_processed=True, processed_at=timezone.now())

def process_paystack_webhook_task(payload):
    event = payload.get('event')
    data = payload.get('data', {})
    reference = data.get('reference')

    if event == 'charge.success':
        finalize_paystack_payment(reference, data)

def finalize_paystack_payment(reference, paystack_data):
    payment = Payment.objects.filter(card_provider_reference=reference).first()
    if not payment:
        return None

    receipt_number = paystack_data.get('reference')
    return process_successful_payment(payment.order, payment, receipt_number, provider_name='PAYSTACK')

def reconcile_pending_mpesa_payments():
    """
    Scheduled job: Query Daraja API for STK requests pending > 2 minutes
    """
    from datetime import timedelta
    from apps.payments.providers.daraja import DarajaPaymentProvider

    two_mins_ago = timezone.now() - timedelta(minutes=2)
    pending_payments = Payment.objects.filter(
        provider=Payment.Provider.MPESA,
        status=Payment.Status.PENDING,
        created_at__lte=two_mins_ago
    )

    daraja = DarajaPaymentProvider()
    for p in pending_payments:
        try:
            res = daraja.verify_payment(p.mpesa_checkout_request_id)
            result_code = res.get('ResultCode')
            if result_code == '0':
                # Success
                receipt = res.get('MpesaReceiptNumber', f"MPESA-{p.order.order_number}")
                process_successful_payment(p.order, p, receipt, provider_name='MPESA')
            elif result_code in ['1032', '1037', '1']:
                p.status = Payment.Status.FAILED
                p.save()
        except Exception as e:
            logger.error("Error querying Daraja for payment %s: %s", p.id, str(e))

def release_expired_unpaid_orders():
    """
    Scheduled job: release reserved stock for orders unpaid after 15 minutes
    """
    from datetime import timedelta
    from django.conf import settings
    from apps.catalog.models import ProductSize

    expiry_minutes = getattr(settings, 'ORDER_EXPIRY_MINUTES', 15)
    cutoff = timezone.now() - timedelta(minutes=expiry_minutes)

    expired_orders = Order.objects.filter(
        status=Order.Status.PENDING,
        payment_status=Order.PaymentStatus.PENDING,
        created_at__lte=cutoff
    )

    for order in expired_orders:
        logger.info("Auto-cancelling unpaid order %s and releasing stock", order.order_number)
        for item in order.items.select_related('product').all():
            product = item.product
            if product:
                size_obj = ProductSize.objects.filter(product=product, label=item.size_label).first()
                target_stock = size_obj if size_obj else product
                target_stock.reserved_quantity = max(0, target_stock.reserved_quantity - item.quantity)
                target_stock.save()

        order.status = Order.Status.CANCELLED
        order.save()
