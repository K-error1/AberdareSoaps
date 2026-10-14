from django.db import models
from apps.core.models import TimeStampedUUIDModel

class PromoCode(TimeStampedUUIDModel):
    class PromoType(models.TextChoices):
        PERCENTAGE = 'PERCENTAGE', 'Percentage'
        FIXED = 'FIXED', 'Fixed Amount (KES)'

    code = models.CharField(max_length=50, unique=True, db_index=True)
    promo_type = models.CharField(max_length=20, choices=PromoType.choices, default=PromoType.PERCENTAGE)
    value = models.PositiveIntegerField(help_text="Percentage (e.g. 10) or whole KES amount (e.g. 200)")
    free_delivery = models.BooleanField(default=False)
    description = models.CharField(max_length=255, blank=True, default='')
    min_order_amount = models.PositiveIntegerField(default=0, help_text="Minimum subtotal in KES")
    max_uses = models.PositiveIntegerField(default=1000)
    used_count = models.PositiveIntegerField(default=0)
    per_user_limit = models.PositiveIntegerField(default=1)
    starts_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.code} ({self.promo_type} - {self.value})"

    def calculate_discount(self, subtotal, delivery_fee=0):
        discount = 0
        delivery_discount = 0

        if self.free_delivery:
            delivery_discount = delivery_fee

        if self.promo_type == self.PromoType.PERCENTAGE:
            discount = (subtotal * self.value) // 100
        elif self.promo_type == self.PromoType.FIXED:
            discount = min(subtotal, self.value)

        return discount, delivery_discount
