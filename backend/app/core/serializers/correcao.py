from rest_framework import serializers
from app.core.models.correcao import Correcao
from .resposta import RespostaSerializer

class CorrecaoSerializer(serializers.ModelSerializer):
    resposta = RespostaSerializer(read_only=True)

    class Meta:
        model = Correcao
        fields = [
            'id',
            'resposta',
            'nota',
            'feedback',
            'created_at',
            'updated_at'
        ]

    def validate_nota(self, value):
        if value < 0 or value > 10:
            raise serializers.ValidationError("A nota deve estar entre 0 e 10.")
        return value