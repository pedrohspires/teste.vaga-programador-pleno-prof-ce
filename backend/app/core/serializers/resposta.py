from rest_framework import serializers
from app.core.models.resposta import Resposta
from app.core.models.usuario import Usuario

class RespostaSerializer(serializers.ModelSerializer):
    nome_aluno = serializers.ReadOnlyField(source='aluno.nome')
    titulo_atividade = serializers.ReadOnlyField(source='atividade.titulo')
    
    nota = serializers.ReadOnlyField(source='correcao.nota')
    feedback_professor = serializers.ReadOnlyField(source='correcao.feedback')

    class Meta:
        model = Resposta
        fields = [
            'id', 'aluno', 'nome_aluno', 'atividade', 
            'titulo_atividade', 'conteudo_resposta', 
            'nota', 'feedback_professor', 'created_at'
        ]