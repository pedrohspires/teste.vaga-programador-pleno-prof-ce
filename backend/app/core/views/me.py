from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404

from app.core.models.resposta import Resposta
from app.core.models.atividade import Atividade
from app.core.serializers.atividade import AtividadeSerializer
from app.core.serializers.correcao import CorrecaoSerializer
from app.core.models.usuario import Usuario

class MeAtividadesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        if user.tipo == Usuario.Tipo.PROFESSOR:
            atividades = Atividade.objects.filter(created_by=user).order_by('-created_at')
            
        elif user.tipo == Usuario.Tipo.ALUNO:
            from app.core.models.aluno_turma import AlunoTurma

            turmas_do_aluno_ids = AlunoTurma.objects.filter(
                aluno=user
            ).values_list('turma_id', flat=True)

            respostas_qs = Resposta.objects.filter(
                aluno=user
            ).select_related('correcao')

            atividades = Atividade.objects.filter(
                turma_id__in=turmas_do_aluno_ids
            ).prefetch_related(
                Prefetch('respostas', queryset=respostas_qs, to_attr='respostas_do_aluno')
            ).order_by('-data_entrega')
            
        else:
            return Response(
                {"detail": "Tipo de usuário não identificado."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = AtividadeSerializer(atividades, many=True)
        return Response(serializer.data)
    
class MeCorrecoesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.tipo != Usuario.Tipo.ALUNO:
            return Response(
                {"detail": "Apenas alunos podem acessar correções."},
                status=status.HTTP_403_FORBIDDEN
            )

        respostas = Resposta.objects.filter(
            aluno=user,
            correcao__isnull=False
        ).select_related(
            'correcao',
            'atividade'
        )

        correcoes = [r.correcao for r in respostas]

        serializer = CorrecaoSerializer(correcoes, many=True)
        return Response(serializer.data)

class MeCorrecaoDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, idCorrecao):
        user = request.user

        if user.tipo != Usuario.Tipo.ALUNO:
            return Response(
                {"detail": "Apenas alunos podem acessar correções."},
                status=status.HTTP_403_FORBIDDEN
            )

        resposta = get_object_or_404(
            Resposta.objects.select_related(
                'correcao',
                'atividade',
                'correcao__resposta',
                'correcao__resposta__atividade'
            ),
            aluno=user,
            correcao__id=idCorrecao
        )

        serializer = CorrecaoSerializer(resposta.correcao)
        return Response(serializer.data)