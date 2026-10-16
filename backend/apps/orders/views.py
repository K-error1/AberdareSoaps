import secrets
import hashlib
from django.db import transaction, models
from django.utils import timezone
from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.conf import settings

from .models import Order, OrderItem, OrderStatusHistory
from .serializers import CreateOrderSerializer, OrderDetailSerializer
from apps.catalog.models import Product, ProductSize
from apps.promos.models import PromoCode
from apps.loyalty.models import LoyaltyLedger
from apps.accounts.models import normalize_kenyan_phone
from apps.accounts.permissions import IsAdminRole

class OrderCreateView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        idempotency_key = request.headers.get('Idempotency-Key')
        if idempotency_key:
            existing_order = Order.objects.filter(idempotency_key=idempotency_key).first()
            if existing_order:
                return Response(OrderDetailSerializer(existing_order).data, status=status.HTTP_200_OK)

        items_input = data['items']
        if not items_input:
            return Response(
                {'error': {'code': 'EMPTY_CART', 'message': 'Cart cannot be empty.', 'details': {}}},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            subtotal = 0
            order_items_to_create = []

            # 1. Lock and validate products & stock
            for item in items_input:
                prod_identifier = item['product_id']
                size_label = item.get('size', 'Standard')
                qty = item['quantity']

                # Lookup by slug or UUID
                product = Product.objects.select_for_update().filter(slug=prod_identifier).first()
                if not product:
                    try:
                        product = Product.objects.select_for_update().get(id=prod_identifier)
                    except Exception:
                        return Response(
                            {'error': {'code': 'PRODUCT_NOT_FOUND', 'message': f'Product {prod_identifier} not found.', 'details': {}}},
                            status=status.HTTP_404_NOT_FOUND
                        )

                # Check variant size
                size_obj = ProductSize.objects.select_for_update().filter(product=product, label=size_label).first()
                unit_price = size_obj.price if size_obj else product.base_price

                # Check stock availability
                target_stock = size_obj if size_obj else product
                if target_stock.available_stock < qty:
                    return Response(
                        {'error': {'code': 'OUT_OF_STOCK', 'message': f'Insufficient stock for {product.name} ({size_label}). Available: {target_stock.available_stock}', 'details': {}}},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Reserve stock and update inventory
                target_stock.reserved_quantity += qty
                target_stock.stock_quantity = max(0, target_stock.stock_quantity - qty)
                target_stock.save()

                if target_stock != product:
                    product.stock_quantity = max(0, product.stock_quantity - qty)
                    if product.stock_quantity <= 0:
                        product.in_stock = False
                    product.save()

                line_total = unit_price * qty
                subtotal += line_total
                order_items_to_create.append({
                    'product': product,
                    'name': product.name,
                    'size': size_label,
                    'unit_price': unit_price,
                    'quantity': qty,
                    'line_total': line_total
                })

            # 2. Delivery calculation
            delivery_option = data['deliveryOption']
            delivery_fee = 0
            if delivery_option == 'pickup':
                delivery_fee = 0
            elif delivery_option == 'nairobi':
                delivery_fee = 0 if subtotal >= 3000 else 250
            elif delivery_option == 'nationwide':
                delivery_fee = 150 if subtotal >= 3000 else 450

            # 3. Promo code calculation
            discount_amount = 0
            promo_obj = None
            promo_code_str = data.get('promoCode', '').strip().upper()
            if promo_code_str:
                promo_obj = PromoCode.objects.filter(code__iexact=promo_code_str, is_active=True).first()
                if promo_obj and promo_obj.used_count < promo_obj.max_uses:
                    disc, del_disc = promo_obj.calculate_discount(subtotal, delivery_fee)
                    discount_amount = disc
                    delivery_fee = max(0, delivery_fee - del_disc)

            # 4. Loyalty points redemption
            points_redeemed = data.get('redeemPoints', 0)
            loyalty_discount = 0
            if points_redeemed > 0 and request.user.is_authenticated:
                user_balance = LoyaltyLedger.get_user_balance(request.user)
                if points_redeemed > user_balance:
                    return Response(
                        {'error': {'code': 'INSUFFICIENT_POINTS', 'message': f'You only have {user_balance} points.', 'details': {}}},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                loyalty_discount = points_redeemed * getattr(settings, 'LOYALTY_POINT_VALUE_KES', 1)

            total = max(0, subtotal - discount_amount - loyalty_discount + delivery_fee)

            # 5. Create Order
            guest_token = None
            guest_token_hash = None
            if not request.user.is_authenticated:
                guest_token = secrets.token_urlsafe(32)
                guest_token_hash = hashlib.sha256(guest_token.encode()).hexdigest()

            pay_method = data['paymentMethod'].upper()
            order = Order.objects.create(
                user=request.user if request.user.is_authenticated else None,
                guest_access_token_hash=guest_token_hash,
                subtotal=subtotal,
                discount_amount=discount_amount + loyalty_discount,
                delivery_fee=delivery_fee,
                loyalty_points_redeemed=points_redeemed,
                total=total,
                promo_code=promo_obj,
                customer_name=data['fullName'],
                customer_phone=normalize_kenyan_phone(data['phone']),
                customer_email=data.get('email', ''),
                delivery_option=delivery_option,
                delivery_county=data.get('county', ''),
                delivery_town=data.get('town', ''),
                delivery_address=data['address'],
                delivery_notes=data.get('notes', ''),
                payment_method=pay_method,
                idempotency_key=idempotency_key
            )

            # 6. Bulk create items
            for itm in order_items_to_create:
                OrderItem.objects.create(
                    order=order,
                    product=itm['product'],
                    product_name_snapshot=itm['name'],
                    size_label=itm['size'],
                    unit_price_snapshot=itm['unit_price'],
                    quantity=itm['quantity'],
                    line_total=itm['line_total']
                )

            # 7. Record status history
            OrderStatusHistory.objects.create(
                order=order,
                from_status='',
                to_status=Order.Status.PENDING,
                notes='Order created, stock reserved.'
            )

            # Record redeemed loyalty points in ledger
            if points_redeemed > 0 and request.user.is_authenticated:
                LoyaltyLedger.record_transaction(
                    user=request.user,
                    points=-points_redeemed,
                    transaction_type=LoyaltyLedger.TransactionType.REDEEMED,
                    order=order,
                    description=f"Redeemed on Order {order.order_number}"
                )

        response_data = OrderDetailSerializer(order).data
        if guest_token:
            response_data['guest_access_token'] = guest_token

        return Response(response_data, status=status.HTTP_201_CREATED)

class OrderDetailOrTrackView(views.APIView):
    """
    Public lookup by order_number (e.g. ABS-7421) or UUID.
    Matches frontend live order tracking modal.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, identifier):
        clean_id = identifier.strip().upper()
        order = Order.objects.filter(order_number=clean_id).first()
        if not order:
            try:
                order = Order.objects.get(id=identifier)
            except Exception:
                return Response(
                    {'error': {'code': 'ORDER_NOT_FOUND', 'message': f'Order {identifier} not found.', 'details': {}}},
                    status=status.HTTP_404_NOT_FOUND
                )

        return Response(OrderDetailSerializer(order).data)

class OrderPaymentStatusView(views.APIView):
    """
    Dedicated endpoint for the frontend to poll payment status.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, identifier):
        clean_id = identifier.strip().upper()
        order = Order.objects.filter(order_number=clean_id).first()
        if not order:
            try:
                order = Order.objects.get(id=identifier)
            except Exception:
                return Response(
                    {'error': {'code': 'ORDER_NOT_FOUND', 'message': 'Order not found.', 'details': {}}},
                    status=status.HTTP_404_NOT_FOUND
                )

        return Response({
            'order_id': order.order_number,
            'status': order.status,
            'payment_status': order.payment_status,
            'payment_method': order.payment_method,
            'mpesa_receipt_number': order.mpesa_receipt_number,
            'is_paid': order.payment_status == Order.PaymentStatus.SUCCESS
        })
class UserOrdersListView(views.APIView):
    """
    List orders belonging to the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        return Response(OrderDetailSerializer(orders, many=True).data)

class AdminOrderListView(views.APIView):
    """
    Admin endpoint to list all orders from the database.
    """
    permission_classes = [IsAdminRole]
    pagination_class = None

    def get(self, request):
        queryset = Order.objects.all().prefetch_related('items', 'status_history').order_by('-created_at')
        status_param = request.query_params.get('status')
        payment_param = request.query_params.get('payment_method')
        search_param = request.query_params.get('search')

        if status_param and status_param.upper() != 'ALL':
            queryset = queryset.filter(status=status_param.upper())
        if payment_param and payment_param.upper() != 'ALL':
            queryset = queryset.filter(payment_method__iexact=payment_param)
        if search_param:
            queryset = queryset.filter(
                models.Q(order_number__icontains=search_param) |
                models.Q(customer_name__icontains=search_param) |
                models.Q(customer_phone__icontains=search_param) |
                models.Q(customer_email__icontains=search_param)
            )

        serializer = OrderDetailSerializer(queryset, many=True)
        return Response(serializer.data)

class AdminOrderStatusUpdateView(views.APIView):
    """
    Admin endpoint to update order status and log in status history.
    """
    permission_classes = [IsAdminRole]

    def patch(self, request, identifier):
        clean_id = identifier.strip().upper()
        order = Order.objects.filter(order_number=clean_id).first()
        if not order:
            try:
                order = Order.objects.get(id=identifier)
            except Exception:
                return Response(
                    {'error': {'code': 'ORDER_NOT_FOUND', 'message': 'Order not found.', 'details': {}}},
                    status=status.HTTP_404_NOT_FOUND
                )

        new_status = request.data.get('status')
        notes = request.data.get('notes', f"Status updated to {new_status}")

        if not new_status:
            return Response({'error': {'message': 'Status is required.'}}, status=status.HTTP_400_BAD_REQUEST)

        valid_statuses = [choice[0] for choice in Order.Status.choices]
        if new_status.upper() not in valid_statuses:
            return Response({'error': {'message': f'Invalid status. Must be one of: {valid_statuses}'}}, status=status.HTTP_400_BAD_REQUEST)

        old_status = order.status
        order.status = new_status.upper()
        if order.status == Order.Status.DELIVERED and order.payment_method == Order.PaymentMethod.COD:
            order.payment_status = Order.PaymentStatus.SUCCESS
        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            from_status=old_status,
            to_status=order.status,
            changed_by=request.user if (request.user and request.user.is_authenticated) else None,
            notes=notes
        )

        return Response(OrderDetailSerializer(order).data)
