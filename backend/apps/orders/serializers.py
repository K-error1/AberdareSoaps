from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory

class OrderItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='product_name_snapshot', read_only=True)
    price = serializers.IntegerField(source='unit_price_snapshot', read_only=True)
    size = serializers.CharField(source='size_label', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'name', 'size', 'price', 'quantity', 'line_total')

class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = ('id', 'from_status', 'to_status', 'notes', 'created_at')

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)

    # Aliases matching React frontend
    id = serializers.CharField(source='order_number', read_only=True)
    uuid = serializers.UUIDField(source='id', read_only=True)
    customerName = serializers.CharField(source='customer_name')
    phone = serializers.CharField(source='customer_phone')
    email = serializers.CharField(source='customer_email')
    deliveryAddress = serializers.CharField(source='delivery_address')
    paymentMethod = serializers.CharField(source='payment_method')
    paymentStatus = serializers.CharField(source='payment_status')
    mpesaRef = serializers.CharField(source='mpesa_receipt_number')

    class Meta:
        model = Order
        fields = (
            'id',
            'uuid',
            'customerName',
            'phone',
            'email',
            'status',
            'subtotal',
            'discount_amount',
            'delivery_fee',
            'total',
            'delivery_option',
            'deliveryAddress',
            'delivery_notes',
            'paymentMethod',
            'paymentStatus',
            'mpesaRef',
            'items',
            'status_history',
            'created_at'
        )

class CartItemInputSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    size = serializers.CharField(required=False, default='Standard')
    quantity = serializers.IntegerField(min_value=1)

class CreateOrderSerializer(serializers.Serializer):
    items = CartItemInputSerializer(many=True)
    fullName = serializers.CharField()
    phone = serializers.CharField()
    email = serializers.EmailField(required=False, allow_blank=True)
    county = serializers.CharField(required=False, allow_blank=True)
    town = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField()
    notes = serializers.CharField(required=False, allow_blank=True)
    deliveryOption = serializers.ChoiceField(choices=['nairobi', 'pickup', 'nationwide'], default='nairobi')
    paymentMethod = serializers.ChoiceField(choices=['mpesa', 'card', 'cod'], default='mpesa')
    promoCode = serializers.CharField(required=False, allow_blank=True)
    redeemPoints = serializers.IntegerField(required=False, default=0, min_value=0)
