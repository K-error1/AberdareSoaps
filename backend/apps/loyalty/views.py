from rest_framework import serializers, views, status, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import LoyaltyLedger

User = get_user_model()

class LoyaltyLedgerSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()

    class Meta:
        model = LoyaltyLedger
        fields = ('id', 'customer_name', 'customer_email', 'points', 'transaction_type', 'balance_after', 'description', 'created_at')

    def get_customer_name(self, obj):
        return obj.user.name or obj.user.email.split('@')[0] if obj.user else 'Guest'

    def get_customer_email(self, obj):
        return obj.user.email if obj.user else ''

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

class AdminLoyaltyLedgerView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        type_param = request.query_params.get('type')
        entries = LoyaltyLedger.objects.all().select_related('user', 'order').order_by('-created_at')
        if type_param and type_param.upper() != 'ALL':
            entries = entries.filter(transaction_type=type_param.upper())
        serializer = LoyaltyLedgerSerializer(entries, many=True)
        return Response(serializer.data)

    def post(self, request):
        user_identifier = request.data.get('user_id') or request.data.get('email')
        points = int(request.data.get('points', 0))
        description = request.data.get('description', 'Manual Admin Adjustment')

        if not user_identifier or points == 0:
            return Response({'error': {'message': 'user_id (or email) and non-zero points required.'}}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=user_identifier).first()
        if not user:
            try:
                user = User.objects.get(id=user_identifier)
            except Exception:
                return Response({'error': {'message': 'User not found'}}, status=status.HTTP_404_NOT_FOUND)

        entry = LoyaltyLedger.record_transaction(
            user=user,
            points=points,
            transaction_type=LoyaltyLedger.TransactionType.ADJUSTMENT,
            description=description
        )

        return Response(LoyaltyLedgerSerializer(entry).data, status=status.HTTP_201_CREATED)
