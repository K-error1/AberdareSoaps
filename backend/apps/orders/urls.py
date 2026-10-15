from django.urls import path
from .views import (
    OrderCreateView, 
    OrderDetailOrTrackView, 
    OrderPaymentStatusView, 
    UserOrdersListView,
    AdminOrderListView,
    AdminOrderStatusUpdateView
)

urlpatterns = [
    path('', OrderCreateView.as_view(), name='order-create'),
    path('user/my-orders/', UserOrdersListView.as_view(), name='user-orders-list'),
    path('admin/', AdminOrderListView.as_view(), name='admin-orders-list'),
    path('admin/<str:identifier>/status/', AdminOrderStatusUpdateView.as_view(), name='admin-order-status-update'),
    path('<str:identifier>/', OrderDetailOrTrackView.as_view(), name='order-detail-track'),
    path('<str:identifier>/payment-status/', OrderPaymentStatusView.as_view(), name='order-payment-status'),
]
