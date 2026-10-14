import secrets
import hashlib
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from drf_spectacular.utils import extend_schema

from .models import User, PasswordResetToken
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)

def set_jwt_cookies(response, access_token, refresh_token):
    secure = getattr(settings, 'JWT_AUTH_COOKIE_SECURE', False)
    samesite = getattr(settings, 'JWT_AUTH_COOKIE_SAMESITE', 'Lax')
    
    # Access cookie
    response.set_cookie(
        settings.JWT_AUTH_COOKIE,
        str(access_token),
        httponly=True,
        secure=secure,
        samesite=samesite,
        max_age=15 * 60, # 15 minutes
        path='/'
    )
    # Refresh cookie
    response.set_cookie(
        settings.JWT_AUTH_REFRESH_COOKIE,
        str(refresh_token),
        httponly=True,
        secure=secure,
        samesite=samesite,
        max_age=7 * 24 * 3600, # 7 days
        path='/'
    )

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=RegisterSerializer, responses={201: UserSerializer})
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        res = Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_201_CREATED)
        set_jwt_cookies(res, refresh.access_token, refresh)
        return res

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=LoginSerializer)
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower()
        password = serializer.validated_data['password']

        user = authenticate(request, email=email, password=password)
        if not user:
            return Response(
                {'error': {'code': 'INVALID_CREDENTIALS', 'message': 'Invalid email or password.', 'details': {}}},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        res = Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        })
        set_jwt_cookies(res, refresh.access_token, refresh)
        return res

class RefreshTokenView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh') or request.COOKIES.get(settings.JWT_AUTH_REFRESH_COOKIE)
        if not refresh_token:
            return Response(
                {'error': {'code': 'TOKEN_REQUIRED', 'message': 'Refresh token missing.', 'details': {}}},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(refresh_token)
            new_access = str(token.access_token)
            token.blacklist()
            new_refresh = RefreshToken.for_user(token.user if hasattr(token, 'user') else None)
            
            res = Response({
                'access': new_access,
                'refresh': str(token)
            })
            set_jwt_cookies(res, new_access, token)
            return res
        except TokenError as e:
            return Response(
                {'error': {'code': 'INVALID_TOKEN', 'message': str(e), 'details': {}}},
                status=status.HTTP_401_UNAUTHORIZED
            )

class LogoutView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh') or request.COOKIES.get(settings.JWT_AUTH_REFRESH_COOKIE)
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        res = Response({'message': 'Logged out successfully.'})
        res.delete_cookie(settings.JWT_AUTH_COOKIE)
        res.delete_cookie(settings.JWT_AUTH_REFRESH_COOKIE)
        return res

class MeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: UserSerializer})
    def get(self, request):
        return Response(UserSerializer(request.user).data)

class PasswordResetRequestView(views.APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=PasswordResetRequestSerializer)
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower()

        try:
            user = User.objects.get(email=email)
            raw_token = secrets.token_urlsafe(32)
            token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
            expires = timezone.now() + timedelta(hours=1)

            PasswordResetToken.objects.create(
                user=user,
                token_hash=token_hash,
                expires_at=expires
            )
            # Enqueue email task via django-q
            from apps.notifications.services import send_password_reset_email_task
            send_password_reset_email_task(user.email, user.name, raw_token)
        except User.DoesNotExist:
            pass # Prevent account enumeration

        return Response({'message': 'If the email exists, a password reset link has been dispatched.'})

class PasswordResetConfirmView(views.APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=PasswordResetConfirmSerializer)
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        raw_token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        reset_token = PasswordResetToken.objects.filter(
            token_hash=token_hash,
            is_used=False,
            expires_at__gt=timezone.now()
        ).first()

        if not reset_token:
            return Response(
                {'error': {'code': 'INVALID_TOKEN', 'message': 'Reset token is invalid or expired.', 'details': {}}},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = reset_token.user
        user.set_password(new_password)
        user.save()
        reset_token.is_used = True
        reset_token.save()

        return Response({'message': 'Password has been successfully updated.'})
