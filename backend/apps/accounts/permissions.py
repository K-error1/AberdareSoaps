from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """
    Allows access only to users with ADMIN role or is_staff/is_superuser.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'ADMIN' or request.user.is_staff or request.user.is_superuser)
        )
