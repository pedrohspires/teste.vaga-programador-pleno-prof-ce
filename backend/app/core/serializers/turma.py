from rest_framework import serializers
from app.core.models import Turma

class TurmaSerializer(serializers.ModelSerializer):
    nome_professor = serializers.ReadOnlyField(source='id_professor.nome')

    class Meta:
        model = Turma
        fields = ['id', 'descricao', 'id_professor', 'nome_professor', 'created_by', 'updated_by', 'created_at', 'updated_at']
        read_only_fields = ['created_by', 'updated_by', 'created_at', 'updated_at']

class TurmaListagemSerializer(serializers.Serializer):
    currentPage = serializers.IntegerField(default=1)
    pageSize = serializers.IntegerField(default=10)
    search = serializers.CharField(required=False, allow_blank=True)