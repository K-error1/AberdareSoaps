import hmac
import hashlib
import requests
from django.conf import settings
from .base import BasePaymentProvider

class PaystackPaymentProvider(BasePaymentProvider):
    def __init__(self):
        self.secret_key = getattr(settings, 'PAYSTACK_SECRET_KEY', '')
        self.base_url = 'https://api.paystack.co'

    def initiate_payment(self, order, callback_url=None, **kwargs):
        """
        Initializes a Paystack transaction in KES.
        Paystack expects amounts in subunits (cents/kobo), so multiply KES by 100.
        """
        url = f"{self.base_url}/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "email": order.customer_email or f"order_{order.order_number}@aberdares.co.ke",
            "amount": int(order.total * 100),
            "currency": "KES",
            "reference": f"{order.order_number}_{order.id.hex[:8]}",
            "metadata": {
                "order_id": str(order.id),
                "order_number": order.order_number,
                "customer_name": order.customer_name,
                "customer_phone": order.customer_phone
            }
        }
        if callback_url:
            payload["callback_url"] = callback_url

        res = requests.post(url, json=payload, headers=headers, timeout=20)
        return res.json()

    def verify_payment(self, reference):
        url = f"{self.base_url}/transaction/verify/{reference}"
        headers = {
            "Authorization": f"Bearer {self.secret_key}"
        }
        res = requests.get(url, headers=headers, timeout=20)
        return res.json()

    @staticmethod
    def verify_webhook_signature(payload_bytes, signature_header, secret_key):
        computed = hmac.new(secret_key.encode('utf-8'), msg=payload_bytes, digestmod=hashlib.sha512).hexdigest()
        return hmac.compare_digest(computed, signature_header)
