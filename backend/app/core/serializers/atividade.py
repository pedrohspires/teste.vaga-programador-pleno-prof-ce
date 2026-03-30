from rest_framework import serializers
from app.core.models.atividade import Atividade

class AtividadeSerializer(serializers.ModelSerializer):
    turma_descricao = serializers.ReadOnlyField(source='turma.descricao')
    nota = serializers.SerializerMethodField()
    id_correcao = serializers.SerializerMethodField()

    class Meta:
        model = Atividade
        fields = [
            'id', 'titulo', 'descricao', 'data_entrega', 
            'turma', 'turma_descricao', 
            'nota', 'id_correcao',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'updated_by']

    def get_nota(self, obj):
        respostas = getattr(obj, 'respostas_do_aluno', [])

        if respostas:
            resposta = respostas[0]
            if hasattr(resposta, 'correcao'):
                return resposta.correcao.nota

        return None

    def get_id_correcao(self, obj):
        respostas = getattr(obj, 'respostas_do_aluno', [])

        if respostas:
            resposta = respostas[0]
            if hasattr(resposta, 'correcao'):
                return resposta.correcao.id

        return None