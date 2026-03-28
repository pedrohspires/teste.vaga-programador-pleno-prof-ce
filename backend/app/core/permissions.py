from rest_framework import permissions

class IsProfessor(permissions.BasePermission):
    def has_permission(self, request, view):
        # Valida se está logado e se é PROFESSOR
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'tipo', None) == 'PROFESSOR'
        )