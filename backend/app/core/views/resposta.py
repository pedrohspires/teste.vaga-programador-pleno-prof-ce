from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.decorators import action
from app.core.models.resposta import Resposta
from app.core.serializers.resposta import RespostaSerializer
from app.core.models.usuario import Usuario

class RespostaViewSet(mixins.CreateModelMixin,
                      viewsets.GenericViewSet):
    
    queryset = Resposta.objects.all()
    serializer_class = RespostaSerializer

    def create(self, request, *args, **kwargs):
        if request.user.tipo != Usuario.Tipo.ALUNO:
            return Response(
                {"detail": "Apenas alunos podem cadastrar respostas."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        data = request.data

        if user.tipo == Usuario.Tipo.PROFESSOR:
            feedback_text = data.get('feedback') or data.get('conteudo_resposta')
            if not feedback_text:
                return Response({"detail": "Informe o conteúdo do feedback."}, status=status.HTTP_400_BAD_REQUEST)
            
            instance.feedback = feedback_text
            instance.updated_by = user
            instance.save()
            return Response(self.get_serializer(instance).data)

        elif user.tipo == Usuario.Tipo.ALUNO:
            if instance.aluno != user:
                return Response({"detail": "Você só pode editar sua própria resposta."}, status=status.HTTP_403_FORBIDDEN)

            if instance.atividade.data_entrega < timezone.now():
                return Response(
                    {"detail": "Prazo expirado. Edição não permitida."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            conteudo = data.get('conteudo_resposta')
            if conteudo:
                instance.conteudo_resposta = conteudo
                instance.updated_by = user
                instance.save()
                return Response(self.get_serializer(instance).data)
            
            return Response({"detail": "Nenhum conteúdo enviado."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Não autorizado."}, status=status.HTTP_403_FORBIDDEN)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='(?P<idAtividade>[^/.]+)/(?P<idAluno>[^/.]+)')
    def buscar_resposta_especifica(self, request, idAtividade=None, idAluno=None):
        try:
            resposta = Resposta.objects.get(
                atividade_id=idAtividade, 
                aluno_id=idAluno
            )
            
            serializer = self.get_serializer(resposta)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Resposta.DoesNotExist:
            return Response(None, status=status.HTTP_404_NOT_FOUND)