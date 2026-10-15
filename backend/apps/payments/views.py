import json
import logging
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import views, status, permissions
from rest_framework.response import Response
from apps.orders.models import Order
from apps.payments.models import Payment, WebhookEvent
from .providers.daraja import DarajaPaymentProvider
from .providers.paystack import PaystackPaymentProvider
from .tasks import process_mpesa_callback_task, process_paystack_webhook_task

logger = logging.getLogger(__name__)

class MpesaStkPushView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        order_id = request.data.get('order_id')
        phone = request.data.get('phone')

        if not order_id:
            return Response(
                {'error': {'code': 'ORDER_ID_REQUIRED', 'message': 'order_id is required.', 'details': {}}},
                status=status.HTTP_400_BAD_REQUEST
            )

        order = Order.objects.filter(order_number=order_id).first()
        if not order:
            try:
                order = Order.objects.get(id=order_id)
            except Exception:
                return Response(
                    {'error': {'code': 'ORDER_NOT_FOUND', 'message': 'Order not found.', 'details': {}}},
                    status=status.HTTP_404_NOT_FOUND
                )

        if order.status != Order.Status.PENDING:
            return Response(
                {'error': {'code': 'INVALID_STATUS', 'message': f'Order cannot be paid. Current status: {order.status}', 'details': {}}},
                status=status.HTTP_400_BAD_REQUEST
            )

        daraja = DarajaPaymentProvider()
        try:
            res = daraja.initiate_payment(order, phone=phone)
            checkout_request_id = res.get('CheckoutRequestID')
            merchant_request_id = res.get('MerchantRequestID')

            payment = Payment.objects.create(
                order=order,
                provider=Payment.Provider.MPESA,
                amount=order.total,
                status=Payment.Status.PENDING,
                mpesa_checkout_request_id=checkout_request_id or '',
                mpesa_merchant_request_id=merchant_request_id or '',
                raw_callback_payload=res
            )

            return Response({
                'message': 'STK Push initiated successfully.',
                'checkout_request_id': checkout_request_id,
                'merchant_request_id': merchant_request_id,
                'response_code': res.get('ResponseCode'),
                'customer_message': res.get('CustomerMessage', 'Please check your phone to enter M-Pesa PIN.')
            })
        except Exception as e:
            logger.error("Daraja STK push error: %s", str(e))
            return Response(
                {'error': {'code': 'MPESA_GATEWAY_ERROR', 'message': str(e), 'details': {}}},
                status=status.HTTP_502_BAD_GATEWAY
            )

@method_decorator(csrf_exempt, name='dispatch')
class MpesaCallbackView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, secret):
        configured_secret = getattr(settings, 'MPESA_CALLBACK_SECRET', '')
        if secret != configured_secret:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        # Optional IP check
        client_ip = request.META.get('REMOTE_ADDR')
        allowlist = getattr(settings, 'SAFARICOM_IP_ALLOWLIST', [])
        if allowlist and client_ip not in allowlist:
            logger.warning("Callback from unverified IP: %s", client_ip)

        payload = request.data
        checkout_request_id = payload.get('Body', {}).get('stkCallback', {}).get('CheckoutRequestID', '')

        # Record webhook event for idempotency
        WebhookEvent.objects.get_or_create(
            provider='MPESA',
            event_id=checkout_request_id,
            defaults={'payload': payload}
        )

        # Dispatch async task for processing
        try:
            process_mpesa_callback_task(payload)
        except Exception as e:
            logger.error("Failed to enqueue mpesa callback task: %s", str(e))

        # Safaricom requires exact acknowledgment
        return Response({"ResultCode": 0, "ResultDesc": "Accepted"})

class PaystackInitializeView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        order_id = request.data.get('order_id')
        callback_url = request.data.get('callback_url')

        order = Order.objects.filter(order_number=order_id).first()
        if not order:
            try:
                order = Order.objects.get(id=order_id)
            except Exception:
                return Response(
                    {'error': {'code': 'ORDER_NOT_FOUND', 'message': 'Order not found.', 'details': {}}},
                    status=status.HTTP_404_NOT_FOUND
                )

        provider = PaystackPaymentProvider()
        res = provider.initiate_payment(order, callback_url=callback_url)
        data = res.get('data', {})

        Payment.objects.create(
            order=order,
            provider=Payment.Provider.PAYSTACK,
            amount=order.total,
            status=Payment.Status.PENDING,
            card_provider_reference=data.get('reference', ''),
            raw_callback_payload=res
        )

        return Response({
            'authorization_url': data.get('authorization_url'),
            'access_code': data.get('access_code'),
            'reference': data.get('reference')
        })

@method_decorator(csrf_exempt, name='dispatch')
class PaystackWebhookView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        secret_key = getattr(settings, 'PAYSTACK_SECRET_KEY', '')
        signature = request.headers.get('x-paystack-signature', '')
        if not PaystackPaymentProvider.verify_webhook_signature(request.body, signature, secret_key):
            return Response({'error': 'Invalid signature'}, status=status.HTTP_403_FORBIDDEN)

        payload = request.data
        event = payload.get('event')
        data = payload.get('data', {})
        reference = data.get('reference')

        WebhookEvent.objects.get_or_create(
            provider='PAYSTACK',
            event_id=reference or event,
            defaults={'payload': payload}
        )

        try:
            process_paystack_webhook_task(payload)
        except Exception as e:
            logger.error("Failed to enqueue paystack webhook task: %s", str(e))

        return Response(status=status.HTTP_200_OK)

class PaystackVerifyView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, reference):
        provider = PaystackPaymentProvider()
        res = provider.verify_payment(reference)
        data = res.get('data', {})

        if data.get('status') == 'success':
            from apps.payments.tasks import finalize_paystack_payment
            order = finalize_paystack_payment(reference, data)
            return Response({
                'status': 'success',
                'order_number': order.order_number if order else '',
                'message': 'Payment confirmed successfully.'
            })

        return Response({
            'status': data.get('status'),
            'message': 'Payment is still pending or was not successful.'
        })

class AdminPaymentListView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        payments = Payment.objects.all().select_related('order').order_by('-created_at')
        provider_param = request.query_params.get('provider')
        status_param = request.query_params.get('status')

        if provider_param and provider_param.upper() != 'ALL':
            payments = payments.filter(provider=provider_param.upper())
        if status_param and status_param.upper() != 'ALL':
            payments = payments.filter(status=status_param.upper())

        results = []
        for p in payments:
            results.append({
                'id': str(p.id),
                'orderNumber': p.order.order_number if p.order else 'N/A',
                'customerName': p.order.customer_name if p.order else 'Unknown',
                'provider': p.provider,
                'amount': p.amount,
                'status': p.status,
                'mpesaReceipt': p.mpesa_receipt_number or (p.mpesa_checkout_request_id[:12] if p.mpesa_checkout_request_id else 'N/A'),
                'date': p.created_at.strftime('%b %d, %Y %H:%M') if p.created_at else '',
                'rawPayload': p.raw_callback_payload
            })
        return Response(results)

