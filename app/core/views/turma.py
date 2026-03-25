from rest_framework import viewsets
from app.core.models.turma import Turma
from app.core.serializers.turma import TurmaSerializer
from app.core.permissions import IsProfessor

class TurmaViewSet(viewsets.ModelViewSet):
    queryset = Turma.objects.all()
    serializer_class = TurmaSerializer
    permission_classes = [IsProfessor]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else FileNotFoundError
        serializer.save(created_by=user, updated_by=user)

    def perform_update(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(updated_by=user)