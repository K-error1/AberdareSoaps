from django.apps import AppConfig


class PaymentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.payments'

    def ready(self):
        """Register recurring Django-Q scheduled tasks on app startup."""
        self._register_scheduled_tasks()

    @staticmethod
    def _register_scheduled_tasks():
        try:
            from django_q.models import Schedule

            # Release reserved stock for orders unpaid after ORDER_EXPIRY_MINUTES
            Schedule.objects.get_or_create(
                func='apps.payments.tasks.release_expired_unpaid_orders',
                defaults={
                    'name': 'Release Expired Unpaid Orders',
                    'schedule_type': Schedule.MINUTES,
                    'minutes': 5,
                    'repeats': -1,
                }
            )

            # Reconcile M-Pesa STK requests that never got a callback
            Schedule.objects.get_or_create(
                func='apps.payments.tasks.reconcile_pending_mpesa_payments',
                defaults={
                    'name': 'Reconcile Pending M-Pesa Payments',
                    'schedule_type': Schedule.MINUTES,
                    'minutes': 3,
                    'repeats': -1,
                }
            )
        except Exception:
            # Silently ignore on first migration or test runs before DB tables exist
            pass
