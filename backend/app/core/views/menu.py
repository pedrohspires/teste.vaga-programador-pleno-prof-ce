from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from app.core.models.usuario import Usuario

class MenuView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        menu = [
            {
                "descricao": "Home",
                "path": "/",
                "icone": "FaHome"
            }
        ]

        if user.tipo == Usuario.Tipo.PROFESSOR:
            menu.extend([
                {
                    "descricao": "Usuários",
                    "path": "/usuario",
                    "icone": "FaUsers"
                },
                {
                    "descricao": "Turmas",
                    "path": "/turma",
                    "icone": "FaChalkboardTeacher"
                },
                {
                    "descricao": "Atividades",
                    "path": "/atividade",
                    "icone": "FaBook"
                }
            ])

        if user.tipo == Usuario.Tipo.ALUNO:
            menu.extend([
                {
                    "descricao": "Respostas",
                    "path": "/respostas/aluno",
                    "icone": "FaFileAlt"
                }
            ])

        return Response(menu)