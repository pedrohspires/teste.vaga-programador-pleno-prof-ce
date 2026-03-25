from django.contrib.auth.models import AbstractUser
from app.core.models.base import AuditoriaModel
from django.db import models

class Usuario(AbstractUser, AuditoriaModel):
    class Tipo(models.TextChoices):
        PROFESSOR = 'PROFESSOR', 'Professor'
        ALUNO = 'ALUNO', 'Aluno'

    nome = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(unique=True)
    tipo = models.CharField(
        max_length=10, 
        choices=Tipo.choices, 
        default=Tipo.ALUNO
    )
  
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome', 'tipo']

    def __str__(self):
        return f"{self.nome} ({self.tipo})"
    
    pass