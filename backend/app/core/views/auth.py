from django.conf import settings
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status

class CookieTokenObtainPairView(TokenObtainPairView):
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