from rest_framework import serializers
from app.core.models.resposta import Resposta
from app.core.models.usuario import Usuario

class RespostaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resposta
        fields = ['id', 'aluno', 'atividade', 'conteudo_resposta', 'feedback', 'created_at']
        read_only_fields = ['feedback']

    def validate_aluno(self, value):
        if value.tipo != Usuario.Tipo.ALUNO:
            raise serializers.ValidationError("Apenas alunos podem enviar respostas.")
        return value