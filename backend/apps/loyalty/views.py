from rest_framework import serializers, views, permissions
from rest_framework.response import Response
from .models import LoyaltyLedger

class LoyaltyLedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyLedger
        fields = ('id', 'points', 'transaction_type', 'balance_after', 'description', 'created_at')

class LoyaltyBalanceView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        balance = LoyaltyLedger.get_user_balance(request.user)
        return Response({
            'user': request.user.email,
            'greenPoints': balance,
            'monetaryValueKes': balance # 1 pt = 1 KES
        })

class LoyaltyHistoryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        entries = LoyaltyLedger.objects.filter(user=request.user)
        serializer = LoyaltyLedgerSerializer(entries, many=True)
        return Response(serializer.data)
