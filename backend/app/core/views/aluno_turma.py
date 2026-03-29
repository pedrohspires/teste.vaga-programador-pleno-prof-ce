from rest_framework import viewsets
from app.core.models.aluno_turma import AlunoTurma
from app.core.serializers.aluno_turma import AlunoTurmaSerializer
from app.core.permissions import IsProfessor
from rest_framework.decorators import action
from rest_framework.response import Response

class AlunoTurmaViewSet(viewsets.ModelViewSet):
    queryset = AlunoTurma.objects.all()
    serializer_class = AlunoTurmaSerializer
    permission_classes = [IsProfessor]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user, updated_by=user)

    @action(detail=False, methods=['get'], url_path='listar-por-turma/(?P<turma_id>[^/.]+)')
    def listar_por_turma(self, request, turma_id=None):
        matriculas = self.get_queryset().filter(turma_id=turma_id)
        serializer = self.get_serializer(matriculas, many=True)
        return Response(serializer.data)