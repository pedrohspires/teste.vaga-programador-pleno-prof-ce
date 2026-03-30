from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, TurmaViewSet, AlunoTurmaViewSet, AtividadeViewSet, MeAtividadesView, RespostaViewSet, CorrecaoViewSet, MeCorrecoesView, MeCorrecaoDetailView, MenuView
from app.core.views.auth import CookieTokenObtainPairView, LogoutView, UsuarioLogadoView

router = DefaultRouter()
router.register(r'usuario', UsuarioViewSet, basename='usuario')
router.register(r'turma', TurmaViewSet, basename='turma')
router.register(r'aluno-turma', AlunoTurmaViewSet, basename='aluno-turma')
router.register(r'atividade', AtividadeViewSet, basename='atividade')
router.register(r'respostas', RespostaViewSet, basename='respostas')
router.register(r'correcao', CorrecaoViewSet, basename='correcao')

urlpatterns = [
    path('auth/login', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/logout', LogoutView.as_view(), name='logout'),
    path('auth/usuario-logado', UsuarioLogadoView.as_view(), name='usuario-logado'),

    path('me/atividades', MeAtividadesView.as_view(), name='me-atividades'),
    path('me/respostas/', MeCorrecoesView.as_view()),
    path('me/correcoes/<int:idCorrecao>/', MeCorrecaoDetailView.as_view()),

    path('menu/', MenuView.as_view()),
    path('', include(router.urls)),
]