from django.db import models
from app.core.models.base import AuditoriaModel
from django.conf import settings

class AlunoTurma(AuditoriaModel):
    aluno = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='matriculas',
        limit_choices_to={'tipo': 'ALUNO'}
    )

    turma = models.ForeignKey(
        'Turma', 
        on_delete=models.CASCADE, 
        related_name='alunos_matriculados'
    )

    class Meta:
        unique_together = ('aluno', 'turma')

    def __str__(self):
        return f"{self.aluno.nome} - {self.turma.descricao}"