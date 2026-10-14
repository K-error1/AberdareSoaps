from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, BarSoapSizeMatrixView

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('products', ProductViewSet, basename='product')

urlpatterns = [
    path('sizes-matrix/', BarSoapSizeMatrixView.as_view(), name='catalog-sizes-matrix'),
    path('', include(router.urls)),
]
