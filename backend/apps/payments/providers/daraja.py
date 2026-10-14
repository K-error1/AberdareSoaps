import base64
import requests
import logging
from datetime import datetime
from zoneinfo import ZoneInfo
from django.conf import settings
from apps.accounts.models import normalize_kenyan_phone
from .base import BasePaymentProvider

logger = logging.getLogger(__name__)

class DarajaPaymentProvider(BasePaymentProvider):
    def __init__(self):
        self.env = getattr(settings, 'MPESA_ENV', 'sandbox')
        self.consumer_key = getattr(settings, 'MPESA_CONSUMER_KEY', '')
        self.consumer_secret = getattr(settings, 'MPESA_CONSUMER_SECRET', '')
        self.shortcode = str(getattr(settings, 'MPESA_SHORTCODE', '174379'))
        self.passkey = getattr(settings, 'MPESA_PASSKEY', '')
        self.callback_secret = getattr(settings, 'MPESA_CALLBACK_SECRET', 'secret')
        self.callback_base_url = getattr(settings, 'MPESA_CALLBACK_BASE_URL', 'http://localhost:8001')

        if self.env == 'production':
            self.base_url = 'https://api.safaricom.co.ke'
        else:
            self.base_url = 'https://sandbox.safaricom.co.ke'

    def get_oauth_token(self):
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        res = requests.get(url, auth=(self.consumer_key, self.consumer_secret), timeout=15)
        res.raise_exception()
        return res.json().get('access_token')

    def generate_password(self, timestamp):
        raw = f"{self.shortcode}{self.passkey}{timestamp}"
        return base64.b64encode(raw.encode()).decode('utf-8')

    def initiate_payment(self, order, phone=None, **kwargs):
        """
        Triggers M-Pesa STK Push
        """
        token = self.get_oauth_token()
        nairobi_tz = ZoneInfo('Africa/Nairobi')
        timestamp = datetime.now(nairobi_tz).strftime('%Y%m%d%H%M%S')
        password = self.generate_password(timestamp)

        target_phone = normalize_kenyan_phone(phone or order.customer_phone)
        callback_url = f"{self.callback_base_url.rstrip('/')}/api/payments/mpesa/callback/{self.callback_secret}/"

        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(order.total),
            "PartyA": target_phone,
            "PartyB": self.shortcode,
            "PhoneNumber": target_phone,
            "CallBackURL": callback_url,
            "AccountReference": order.order_number,
            "TransactionDesc": f"Aberdares Order {order.order_number}"
        }

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        res = requests.post(url, json=payload, headers=headers, timeout=20)
        return res.json()

    def verify_payment(self, checkout_request_id):
        """
        Query STK status via Daraja Query API
        """
        token = self.get_oauth_token()
        nairobi_tz = ZoneInfo('Africa/Nairobi')
        timestamp = datetime.now(nairobi_tz).strftime('%Y%m%d%H%M%S')
        password = self.generate_password(timestamp)

        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id
        }

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        url = f"{self.base_url}/mpesa/stkpushquery/v1/query"
        res = requests.post(url, json=payload, headers=headers, timeout=20)
        return res.json()
