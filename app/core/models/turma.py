from django.db import models
from django.contrib.auth.models import User
from app.core.models.base import AuditoriaModel
from django.conf import settings

class Turma(AuditoriaModel):
    descricao = models.CharField(max_length=255)

    id_professor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='turmas_docentes'
    )

    REQUIRED_FIELDS = ['descricao', 'id_professor']

    def __str__(self):
        return self.descricao