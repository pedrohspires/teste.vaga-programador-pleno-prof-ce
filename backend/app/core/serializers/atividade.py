from rest_framework import serializers
from app.core.models.atividade import Atividade

class AtividadeSerializer(serializers.ModelSerializer):
    turma_descricao = serializers.ReadOnlyField(source='turma.descricao')

    class Meta:
        model = Atividade
        fields = [
            'id', 'titulo', 'descricao', 'data_entrega', 
            'turma', 'turma_descricao', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'updated_by']