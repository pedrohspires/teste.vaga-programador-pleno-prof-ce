from django.conf import settings
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate

class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField(
        error_messages={
            'blank': 'O campo de e-mail não pode estar vazio.',
            'required': 'O e-mail é obrigatório.',
            'invalid': 'Insira um formato de e-mail válido.'
        }
    )

    senha = serializers.CharField(
        write_only=True,
        error_messages={
            'blank': 'O campo de senha não pode estar vazio.',
            'required': 'A senha é obrigatória.'
        }
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('senha')

        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError({
                "detail": "E-mail ou senha incorretos. Verifique suas credenciais."
            })

        if not user.is_active:
            raise serializers.ValidationError({
                "detail": "Esta conta de usuário está inativa."
            })

        refresh = TokenObtainPairSerializer.get_token(user)

        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        return data
        
class CookieTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            del response.data['access']
            del response.data['refresh']
            response.data['message'] = "Login realizado com sucesso"

            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=3600
            )

            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=86400 # 1 dia
            )

        return response
    
class LogoutView(APIView):
    def post(self, request):
        response = Response(
            {"message": "Logout realizado com sucesso"}, 
            status=status.HTTP_200_OK
        )
        response.delete_cookie(
            key=settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token'),
            samesite='Lax'
        )
        response.delete_cookie('refresh_token', samesite='Lax')
        
        return response
    
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "id": str(user.id),
            "nome": user.get_full_name() or user.username,
            "email": user.email,
            "tipo": getattr(user, 'tipo', 'ALUNO')
        }
        return Response(data)