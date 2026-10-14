from rest_framework import serializers, views, status, permissions
from rest_framework.response import Response
from django.utils import timezone
from .models import PromoCode

class PromoCodeValidateSerializer(serializers.Serializer):
    code = serializers.CharField()
    subtotal = serializers.IntegerField(min_value=0)
    delivery_fee = serializers.IntegerField(min_value=0, default=0)

class PromoValidateView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PromoCodeValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code_input = serializer.validated_data['code'].strip().upper()
        subtotal = serializer.validated_data['subtotal']
        delivery_fee = serializer.validated_data['delivery_fee']

        now = timezone.now()
        promo = PromoCode.objects.filter(code__iexact=code_input, is_active=True).first()

        if not promo:
            return Response(
                {'error': {'code': 'INVALID_PROMO', 'message': 'Promo code does not exist or is inactive.', 'details': {}}},
                status=status.HTTP_400_BAD_REQUEST
            )

        if promo.starts_at and promo.starts_at > now:
            return Response(
                {'error': {'code': 'PROMO_NOT_STARTED', 'message': 'Promo code is not yet active.', 'details': {}}},
                status=status.HTTP_400_BAD_REQUEST
            )

        if promo.expires_at and promo.expires_at < now:
            return Response(
                {'error': {'code': 'PROMO_EXPIRED', 'message': 'Promo code has expired.', 'details': {}}},
                status=status.HTTP_400_BAD_REQUEST
            )

        if promo.used_count >= promo.max_uses:
            return Response(
                {'error': {'code': 'PROMO_EXHAUSTED', 'message': 'Promo code maximum redemptions reached.', 'details': {}}},
                status=status.HTTP_400_BAD_REQUEST
            )

        if subtotal < promo.min_order_amount:
            return Response(
                {'error': {'code': 'MIN_AMOUNT_NOT_MET', 'message': f'Minimum order subtotal of KES {promo.min_order_amount} required.', 'details': {}}},
                status=status.HTTP_400_BAD_REQUEST
            )

        discount, delivery_discount = promo.calculate_discount(subtotal, delivery_fee)

        return Response({
            'code': promo.code,
            'discount': discount,
            'discountPercent': promo.value if promo.promo_type == PromoCode.PromoType.PERCENTAGE else None,
            'freeDelivery': promo.free_delivery,
            'description': promo.description,
            'applied_delivery_fee': max(0, delivery_fee - delivery_discount)
        })
