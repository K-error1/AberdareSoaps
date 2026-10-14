import uuid
import random
from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedUUIDModel

def generate_order_number():
    """Generates customer-friendly tracking code like ABS-7421"""
    return f"ABS-{random.randint(1000, 9999)}"

class Order(TimeStampedUUIDModel):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Payment'
        PAID = 'PAID', 'Paid'
        PROCESSING = 'PROCESSING', 'Processing & Formulation at Ruiru'
        OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', 'Out for Delivery'
        DELIVERED = 'DELIVERED', 'Delivered'
        CANCELLED = 'CANCELLED', 'Cancelled'
        FAILED = 'FAILED', 'Payment Failed'

    class PaymentMethod(models.TextChoices):
        MPESA = 'MPESA', 'M-Pesa STK Push'
        CARD = 'CARD', 'Credit / Debit Card'
        COD = 'COD', 'Cash / M-Pesa on Delivery'

    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        SUCCESS = 'SUCCESS', 'Success'
        FAILED = 'FAILED', 'Failed'

    order_number = models.CharField(max_length=20, unique=True, default=generate_order_number, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    guest_access_token_hash = models.CharField(max_length=128, blank=True, null=True, db_index=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING, db_index=True)
    
    # Financial fields stored as integers (whole KES)
    subtotal = models.PositiveIntegerField()
    discount_amount = models.PositiveIntegerField(default=0)
    delivery_fee = models.PositiveIntegerField(default=0)
    loyalty_points_redeemed = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField()

    promo_code = models.ForeignKey('promos.PromoCode', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    
    # Customer Details
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=20)
    customer_email = models.EmailField(blank=True, default='')

    # Delivery fields
    delivery_option = models.CharField(max_length=50, default='nairobi') # nairobi, pickup, nationwide
    delivery_county = models.CharField(max_length=100, blank=True, default='')
    delivery_town = models.CharField(max_length=100, blank=True, default='')
    delivery_address = models.TextField()
    delivery_notes = models.TextField(blank=True, default='')

    # Payment fields
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.MPESA)
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    mpesa_receipt_number = models.CharField(max_length=50, blank=True, default='', db_index=True)

    idempotency_key = models.CharField(max_length=128, unique=True, null=True, blank=True, db_index=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.order_number} ({self.status}) - KES {self.total}"

class OrderItem(TimeStampedUUIDModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('catalog.Product', on_delete=models.SET_NULL, null=True)
    product_name_snapshot = models.CharField(max_length=255)
    size_label = models.CharField(max_length=50, default='Standard')
    unit_price_snapshot = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()
    line_total = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity}x {self.product_name_snapshot} ({self.size_label})"

class OrderStatusHistory(TimeStampedUUIDModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    from_status = models.CharField(max_length=30)
    to_status = models.CharField(max_length=30)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['-created_at']
