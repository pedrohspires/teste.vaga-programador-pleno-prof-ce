from rest_framework import viewsets, status, mixins
from app.core.models.usuario import Usuario
from app.core.serializers.usuario import UsuarioSerializer, UsuarioListagemSerializer
from app.core.permissions import IsProfessor
from django.db.models import Q
from django.core.paginator import Paginator
from rest_framework.decorators import action
from rest_framework.response import Response

class UsuarioViewSet(mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin,
                     viewsets.GenericViewSet):
    
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsProfessor]

    @action(detail=False, methods=['post'], url_path='listagem')
    def listar_paginado(self, request):
        current_page = request.data.get('currentPage', 1)
        page_size = request.data.get('pageSize', 10)
        search_text = request.data.get('search', '')
        tipo = request.data.get('tipo', None)

        queryset = self.get_queryset().order_by('-created_at')
        if search_text:
            queryset = queryset.filter(
                Q(nome__icontains=search_text) | Q(username__icontains=search_text)
            )

        if tipo:
            queryset = queryset.filter(
                Q(tipo__icontains=tipo)
            )

        paginator = Paginator(queryset, page_size)
        
        try:
            page_obj = paginator.page(current_page)
        except:
            return Response({
                "items": [],
                "total": paginator.count,
                "message": "Página não encontrada"
            }, status=status.HTTP_400_BAD_REQUEST)

        items_serializer = UsuarioSerializer(page_obj.object_list, many=True)

        return Response({
            "items": items_serializer.data,
            "total": paginator.count,
            "currentPage": page_obj.number,
            "pageSize": int(page_size),
            "totalPages": paginator.num_pages
        })

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            user = None
        serializer.save(created_by=user, updated_by=user)

    def perform_update(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            user = None
        serializer.save(updated_by=self.request.user)

    @action(detail=True, methods=['patch'], url_path='AlterarSenha')
    def alterar_senha(self, request, pk=None):
        usuario = self.get_object() 
        password = request.data.get('password')

        if not password:
            return Response(
                {"password": "Este campo é obrigatório."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario.set_password(password)
        
        if request.user.is_authenticated:
            usuario.updated_by = request.user
            
        usuario.save()

        return Response(
            {"message": "Senha alterada com sucesso!"}, 
            status=status.HTTP_200_OK
        )

    def get_serializer_class(self):
        if self.action == 'listar_paginado': 
            return UsuarioListagemSerializer
        return UsuarioSerializer