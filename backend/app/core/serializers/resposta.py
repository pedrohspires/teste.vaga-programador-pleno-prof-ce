from rest_framework import serializers
from app.core.models.resposta import Resposta
from app.core.models.usuario import Usuario

class RespostaSerializer(serializers.ModelSerializer):
    nome_aluno = serializers.ReadOnlyField(source='aluno.nome')
    titulo_atividade = serializers.ReadOnlyField(source='atividade.titulo')

    class Meta:
        model = Resposta
        fields = ['id', 'aluno', 'nome_aluno', 'atividade', 'titulo_atividade', 'conteudo_resposta', 'created_at']

    def validate_aluno(self, value):
        if value.tipo != Usuario.Tipo.ALUNO:
            raise serializers.ValidationError("Apenas alunos podem enviar respostas.")
        return value