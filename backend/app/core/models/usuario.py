from django.contrib.auth.models import AbstractUser, BaseUserManager
from app.core.models.base import AuditoriaModel
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O email é obrigatório')
        email = self.normalize_email(email)
        extra_fields.setdefault('username', email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('tipo', 'PROFESSOR')
        return self.create_user(email, password, **extra_fields)

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
  
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome', 'tipo']

    def __str__(self):
        return f"{self.nome} ({self.tipo})"
    
    pass