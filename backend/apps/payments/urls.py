from django.urls import path
from .views import (
    MpesaStkPushView,
    MpesaCallbackView,
    PaystackInitializeView,
    PaystackWebhookView,
    PaystackVerifyView,
    AdminPaymentListView
)

urlpatterns = [
    # Admin
    path('admin/', AdminPaymentListView.as_view(), name='admin-payments-list'),

    # M-Pesa Daraja
    path('mpesa/stk-push/', MpesaStkPushView.as_view(), name='mpesa-stk-push'),
    path('mpesa/callback/<str:secret>/', MpesaCallbackView.as_view(), name='mpesa-callback'),

    # Paystack Cards
    path('paystack/initialize/', PaystackInitializeView.as_view(), name='paystack-init'),
    path('paystack/webhook/', PaystackWebhookView.as_view(), name='paystack-webhook'),
    path('paystack/verify/<str:reference>/', PaystackVerifyView.as_view(), name='paystack-verify'),
]
