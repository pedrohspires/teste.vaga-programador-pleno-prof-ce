from rest_framework import viewsets
from app.core.models.usuario import Usuario
from app.core.serializers.usuario import UsuarioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def perform_create(self, serializer):
        # Salva o usuário logado como criador
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        # Atualiza apenas o campo de quem editou por último
        serializer.save(updated_by=self.request.user)