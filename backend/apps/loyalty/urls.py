from django.urls import path
from .views import LoyaltyBalanceView, LoyaltyHistoryView, AdminLoyaltyLedgerView

urlpatterns = [
    path('balance/', LoyaltyBalanceView.as_view(), name='loyalty-balance'),
    path('history/', LoyaltyHistoryView.as_view(), name='loyalty-history'),
    path('admin/ledger/', AdminLoyaltyLedgerView.as_view(), name='admin-loyalty-ledger'),
    path('admin/adjust/', AdminLoyaltyLedgerView.as_view(), name='admin-loyalty-adjust'),
]
