from django.db import models
from app.core.models.base import AuditoriaModel
from app.core.models.turma import Turma

class Atividade(AuditoriaModel):
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    data_entrega = models.DateTimeField()
    
    turma = models.ForeignKey(
        Turma, 
        on_delete=models.CASCADE, 
        related_name='atividades'
    )

    def __str__(self):
        return f"{self.titulo} - {self.turma.descricao}"