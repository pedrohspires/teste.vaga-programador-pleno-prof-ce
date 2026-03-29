from rest_framework import serializers
from app.core.models.aluno_turma import AlunoTurma
from app.core.models.usuario import Usuario

class AlunoTurmaSerializer(serializers.ModelSerializer):
    nome_aluno = serializers.ReadOnlyField(source='aluno.nome')
    descricao_turma = serializers.ReadOnlyField(source='turma.descricao')

    class Meta:
        model = AlunoTurma
        fields = ['id', 'aluno', 'turma', 'nome_aluno', 'descricao_turma', 'created_by', 'updated_by', 'created_at', 'updated_at']

    def validate_aluno(self, value):
        if value.tipo != Usuario.Tipo.ALUNO:
            raise serializers.ValidationError("Apenas usuários do tipo ALUNO podem ser vinculados a uma turma.")
        return value