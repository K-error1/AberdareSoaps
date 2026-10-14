from django.urls import path
from .views import LoyaltyBalanceView, LoyaltyHistoryView

urlpatterns = [
    path('balance/', LoyaltyBalanceView.as_view(), name='loyalty-balance'),
    path('history/', LoyaltyHistoryView.as_view(), name='loyalty-history'),
]
