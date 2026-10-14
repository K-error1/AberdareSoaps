import logging
import requests
from django.conf import settings
from apps.accounts.models import normalize_kenyan_phone

logger = logging.getLogger(__name__)

def send_sms(to_phone, message):
    """
    Dispatches SMS via Africa's Talking REST API
    """
    username = getattr(settings, 'AFRICASTALKING_USERNAME', 'sandbox')
    api_key = getattr(settings, 'AFRICASTALKING_API_KEY', '')
    sender_id = getattr(settings, 'AFRICASTALKING_SENDER_ID', 'ABERDARES')

    if not api_key:
        logger.info("[SMS MOCK - No API Key] To: %s | Message: %s", to_phone, message)
        return {"status": "mocked"}

    url = "https://api.africastalking.com/version1/messaging"
    if username == "sandbox":
        url = "https://api.sandbox.africastalking.com/version1/messaging"

    headers = {
        "apiKey": api_key,
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
    }

    normalized = normalize_kenyan_phone(to_phone)
    if not normalized.startswith('+'):
        normalized = '+' + normalized

    data = {
        "username": username,
        "to": normalized,
        "message": message
    }
    if sender_id and username != "sandbox":
        data["from"] = sender_id

    try:
        res = requests.post(url, data=data, headers=headers, timeout=15)
        logger.info("Africa's Talking SMS response: %s", res.text)
        return res.json()
    except Exception as e:
        logger.error("Error dispatching SMS via Africa's Talking: %s", str(e))
        return None

def send_email(to_email, subject, html_content):
    """
    Dispatches transactional HTML email via Resend
    """
    api_key = getattr(settings, 'RESEND_API_KEY', '')
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'orders@aberdares.co.ke')

    if not api_key:
        logger.info("[EMAIL MOCK - No API Key] To: %s | Subject: %s", to_email, subject)
        return {"status": "mocked"}

    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "from": from_email,
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }

    try:
        res = requests.post(url, json=payload, headers=headers, timeout=15)
        logger.info("Resend email response: %s", res.text)
        return res.json()
    except Exception as e:
        logger.error("Error dispatching email via Resend: %s", str(e))
        return None

# Task wrappers
def send_payment_confirmation_sms_task(order_id):
    from apps.orders.models import Order
    order = Order.objects.get(id=order_id)
    msg = (
        f"ABERDARES: Confirmed. Order {order.order_number} of KES {order.total:,} "
        f"placed successfully. Ref: {order.mpesa_receipt_number or 'CONFIRMED'}. "
        f"Dispatching to {order.customer_name}, {order.delivery_address}. "
        f"Thank you for supporting Kenyan natural manufacturing!"
    )
    send_sms(order.customer_phone, msg)

def send_order_receipt_email_task(order_id):
    from apps.orders.models import Order
    order = Order.objects.get(id=order_id)
    if not order.customer_email:
        return

    items_html = "".join([
        f"<tr><td>{item.quantity}x {item.product_name_snapshot} ({item.size_label})</td><td style='text-align:right'>KES {item.line_total:,}</td></tr>"
        for item in order.items.all()
    ])

    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2d6a4f;">Aberdares Soaps — Official Order Receipt</h2>
        <p>Asante Sana, <strong>{order.customer_name}</strong>!</p>
        <p>Your order <strong>{order.order_number}</strong> has been received at our Ruiru manufacturing facility and is being prepped for dispatch.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
                <tr style="border-bottom: 2px solid #cbd5e1; text-align: left;">
                    <th>Item</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                {items_html}
            </tbody>
        </table>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <div style="font-size: 14px; line-height: 1.6;">
            <div><strong>Subtotal:</strong> KES {order.subtotal:,}</div>
            <div><strong>Discount:</strong> - KES {order.discount_amount:,}</div>
            <div><strong>Delivery:</strong> KES {order.delivery_fee:,}</div>
            <div style="font-size: 18px; color: #2d6a4f; margin-top: 8px;"><strong>Total Paid:</strong> KES {order.total:,}</div>
            <div><strong>Payment Method:</strong> {order.payment_method} ({order.mpesa_receipt_number})</div>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 30px;">
            Aberdares Soaps • Nature Meets Innovation • Ruiru Kimbo, Matangi Road, Kenya
        </p>
    </div>
    """
    send_email(order.customer_email, f"Aberdares Receipt — Order {order.order_number}", html)

def send_password_reset_email_task(user_email, user_name, raw_token):
    html = f"""
    <div style="font-family: sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Hello {user_name},</p>
        <p>You requested a password reset for your Aberdares account. Use the token below:</p>
        <p style="font-family: monospace; background: #f1f5f9; padding: 10px; border-radius: 6px; font-size: 16px;">{raw_token}</p>
        <p>If you did not request this, please ignore this email.</p>
    </div>
    """
    send_email(user_email, "Aberdares Password Reset Token", html)
