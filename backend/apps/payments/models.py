from django.db import models
from apps.core.models import TimeStampedUUIDModel

class Payment(TimeStampedUUIDModel):
    class Provider(models.TextChoices):
        MPESA = 'MPESA', 'Safaricom M-Pesa Daraja'
        PAYSTACK = 'PAYSTACK', 'Paystack'

    class Status(models.TextChoices):
        INITIATED = 'INITIATED', 'Initiated'
        PENDING = 'PENDING', 'Pending User Action'
        SUCCESS = 'SUCCESS', 'Successful'
        FAILED = 'FAILED', 'Failed'
        CANCELLED = 'CANCELLED', 'Cancelled by User'

    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='payments')
    provider = models.CharField(max_length=20, choices=Provider.choices)
    amount = models.PositiveIntegerField(help_text="Whole KES integer")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.INITIATED, db_index=True)

    # Daraja specific identifiers
    mpesa_checkout_request_id = models.CharField(max_length=100, blank=True, default='', db_index=True)
    mpesa_merchant_request_id = models.CharField(max_length=100, blank=True, default='', db_index=True)
    mpesa_receipt_number = models.CharField(max_length=50, blank=True, default='', db_index=True)

    # Paystack / Card specific identifiers
    card_provider_reference = models.CharField(max_length=100, blank=True, default='', db_index=True)

    raw_callback_payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.provider} Payment - KES {self.amount} ({self.status}) for {self.order.order_number}"

class WebhookEvent(TimeStampedUUIDModel):
    provider = models.CharField(max_length=50, db_index=True) # MPESA, PAYSTACK
    event_id = models.CharField(max_length=150, unique=True, db_index=True) # CheckoutRequestID or Paystack Reference
    payload = models.JSONField()
    is_processed = models.BooleanField(default=False)
    processed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"WebhookEvent ({self.provider}) - {self.event_id} [processed={self.is_processed}]"
