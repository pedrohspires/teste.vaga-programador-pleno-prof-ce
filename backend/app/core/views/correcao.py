from rest_framework.decorators import action
from rest_framework import viewsets, status
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from app.core.models.correcao import Correcao
from app.core.serializers.correcao import CorrecaoSerializer
from app.core.permissions import IsProfessor

class CorrecaoViewSet(viewsets.ModelViewSet):
    queryset = Correcao.objects.all()
    serializer_class = CorrecaoSerializer
    permission_classes = [IsProfessor]

    def perform_create(self, serializer):
        resposta = serializer.validated_data.get('resposta')

        if resposta.atividade.created_by != self.request.user:
            return Response({"detail": "Você só pode corrigir atividades criadas por você."}, status=status.HTTP_403_FORBIDDEN)

        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user
        )

    def perform_update(self, serializer):
        instance = self.get_object()

        if instance.resposta.atividade.created_by != self.request.user:
            return Response({"detail": "Você só pode corrigir atividades criadas por você."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer.save(updated_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='buscar/(?P<idResposta>[^/.]+)')
    def buscar_por_resposta(self, request, idResposta=None):
        correcao = get_object_or_404(Correcao, resposta_id=idResposta)
        serializer = self.get_serializer(correcao)
        return Response(serializer.data, status=status.HTTP_200_OK)