from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PromoValidateView, AdminPromoCodeViewSet

router = DefaultRouter()
router.register(r'admin', AdminPromoCodeViewSet, basename='admin-promos')

urlpatterns = [
    path('validate/', PromoValidateView.as_view(), name='promo-validate'),
    path('', include(router.urls)),
]
