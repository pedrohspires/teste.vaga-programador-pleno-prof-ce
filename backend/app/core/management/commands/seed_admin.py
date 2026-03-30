import os
from django.core.management.base import BaseCommand
from app.core.models.usuario import Usuario

class Command(BaseCommand):
    help = 'Cria um usuário administrador inicial baseado no arquivo .env'

    def handle(self, *args, **kwargs):
        nome = os.getenv('ADMIN_NOME', 'Admin')
        email = os.getenv('ADMIN_EMAIL')
        password = os.getenv('ADMIN_PASSWORD')

        if not email or not password:
            self.stdout.write(self.style.ERROR('Erro: ADMIN_EMAIL e ADMIN_PASSWORD devem estar no .env'))
            return

        if Usuario.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'Usuário {email} já existe.'))
            return

        try:
            Usuario.objects.create_superuser(
                email=email,
                password=password,
                nome=nome,
                tipo=Usuario.Tipo.PROFESSOR
            )
            self.stdout.write(self.style.SUCCESS(f'Admin "{nome}" ({email}) criado com sucesso!'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erro ao criar admin: {e}'))