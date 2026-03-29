from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from app.core.models.base import AuditoriaModel
from app.core.models.resposta import Resposta

class Correcao(AuditoriaModel):
    resposta = models.OneToOneField(
        Resposta, 
        on_delete=models.CASCADE, 
        related_name='correcao'
    )
    nota = models.DecimalField(
        max_digits=4, 
        decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    feedback = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Correção da Resposta {self.resposta.id} - Nota: {self.nota}"