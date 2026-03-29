from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from app.core.models.atividade import Atividade
from app.core.serializers.atividade import AtividadeSerializer
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

            atividades = Atividade.objects.filter(
                turma_id__in=turmas_do_aluno_ids
            ).select_related('turma').order_by('-data_entrega')
            
        else:
            return Response(
                {"detail": "Tipo de usuário não identificado."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = AtividadeSerializer(atividades, many=True)
        return Response(serializer.data)