from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CustomJWTCookieAuthentication(JWTAuthentication):
    """
    Looks for JWT token either in HTTP Authorization Bearer header
    OR in the httpOnly secure cookie specified in settings.
    """
    def authenticate(self, request):
        # 1. Try default Authorization header first
        header = self.get_header(request)
        if header is not None:
            raw_token = self.get_raw_token(header)
            if raw_token is not None:
                validated_token = self.get_validated_token(raw_token)
                return self.get_user(validated_token), validated_token

        # 2. Fallback to HttpOnly cookie
        cookie_name = getattr(settings, 'JWT_AUTH_COOKIE', 'aberdares_access_token')
        raw_token = request.COOKIES.get(cookie_name)
        if raw_token:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token

        return None
