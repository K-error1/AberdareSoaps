from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedUUIDModel

class LoyaltyLedger(TimeStampedUUIDModel):
    class TransactionType(models.TextChoices):
        EARNED = 'EARNED', 'Earned from purchase'
        REDEEMED = 'REDEEMED', 'Redeemed on order'
        ADJUSTMENT = 'ADJUSTMENT', 'Admin Adjustment'
        EXPIRED = 'EXPIRED', 'Points Expired'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='loyalty_entries')
    order = models.ForeignKey('orders.Order', on_delete=models.SET_NULL, null=True, blank=True, related_name='loyalty_entries')
    points = models.IntegerField(help_text="Positive for earned/adjustment, negative for redeemed")
    transaction_type = models.CharField(max_length=20, choices=TransactionType.choices)
    balance_after = models.IntegerField()
    description = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email}: {self.points} pts ({self.transaction_type}) -> {self.balance_after}"

    @classmethod
    def get_user_balance(cls, user):
        latest = cls.objects.filter(user=user).first()
        return latest.balance_after if latest else 0

    @classmethod
    def record_transaction(cls, user, points, transaction_type, order=None, description=''):
        current_balance = cls.get_user_balance(user)
        new_balance = current_balance + points
        return cls.objects.create(
            user=user,
            order=order,
            points=points,
            transaction_type=transaction_type,
            balance_after=new_balance,
            description=description
        )
