from rest_framework import serializers
from .models import User, validate_kenyan_phone, normalize_kenyan_phone

class UserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'phone', 'role', 'created_at')
        read_only_fields = ('id', 'role', 'created_at')

    def validate_phone(self, value):
        if value:
            value = str(value).strip()
            if not value:
                return None
            validate_kenyan_phone(value)
            return normalize_kenyan_phone(value)
        return None

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True, default=None)

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'phone', 'password')

    def validate_phone(self, value):
        if value:
            value = str(value).strip()
            if not value:
                return None
            validate_kenyan_phone(value)
            return normalize_kenyan_phone(value)
        return None

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
