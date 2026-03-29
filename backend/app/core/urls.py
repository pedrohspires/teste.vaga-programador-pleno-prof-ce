from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, TurmaViewSet, AlunoTurmaViewSet
from app.core.views.auth import CookieTokenObtainPairView, LogoutView, UsuarioLogadoView

router = DefaultRouter()
router.register(r'usuario', UsuarioViewSet, basename='usuario')
router.register(r'turma', TurmaViewSet, basename='turma')
router.register(r'aluno-turma', AlunoTurmaViewSet, basename='aluno-turma')

urlpatterns = [
    path('auth/login', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/logout', LogoutView.as_view(), name='logout'),
    path('auth/usuario-logado', UsuarioLogadoView.as_view(), name='usuario-logado'),

    path('', include(router.urls)),
]