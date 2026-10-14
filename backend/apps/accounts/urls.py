from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    GoogleAuthView,
    RefreshTokenView,
    LogoutView,
    MeView,
    PasswordResetRequestView,
    PasswordResetConfirmView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('google/', GoogleAuthView.as_view(), name='auth-google'),
    path('refresh/', RefreshTokenView.as_view(), name='auth-refresh'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('me/', MeView.as_view(), name='auth-me'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='auth-reset-request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='auth-reset-confirm'),
]

