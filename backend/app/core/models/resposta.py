from django.db import models
from app.core.models.base import AuditoriaModel
from app.core.models.usuario import Usuario
from app.core.models.atividade import Atividade

class Resposta(AuditoriaModel):
    aluno = models.ForeignKey(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='respostas_enviadas',
        limit_choices_to={'tipo': Usuario.Tipo.ALUNO}
    )
    atividade = models.ForeignKey(
        Atividade, 
        on_delete=models.CASCADE, 
        related_name='respostas'
    )
    conteudo_resposta = models.TextField()
    feedback = models.TextField(null=True, blank=True) 

    class Meta:
        unique_together = ('aluno', 'atividade')

    def __str__(self):
        return f"Resposta de {self.aluno.nome} - {self.atividade.titulo}"