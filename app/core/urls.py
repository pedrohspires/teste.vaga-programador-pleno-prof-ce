from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet
from app.core.views.auth import CookieTokenObtainPairView, LogoutView

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')

urlpatterns = [
    path('auth/login/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),

    path('', include(router.urls)),
]