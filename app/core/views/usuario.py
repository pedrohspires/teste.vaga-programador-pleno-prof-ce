from rest_framework import viewsets
from app.core.models.usuario import Usuario
from app.core.serializers.usuario import UsuarioSerializer
from app.core.permissions import IsProfessor

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsProfessor]

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            user = None
        serializer.save(created_by=user, updated_by=user)

    def perform_update(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            user = None
        serializer.save(updated_by=self.request.user)