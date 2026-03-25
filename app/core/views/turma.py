from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.core.paginator import Paginator
from app.core.models.turma import Turma
from app.core.serializers.turma import TurmaSerializer, TurmaListagemSerializer
from app.core.permissions import IsProfessor

class TurmaViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   viewsets.GenericViewSet):
    
    queryset = Turma.objects.select_related('id_professor').all()
    serializer_class = TurmaSerializer
    permission_classes = [IsProfessor]

    @action(detail=False, methods=['post'], url_path='listagem')
    def listar_paginado(self, request):
        current_page = request.data.get('currentPage', 1)
        page_size = request.data.get('pageSize', 10)
        search_text = request.data.get('search', '')

        queryset = self.get_queryset().order_by('-created_at')
        if search_text:
            queryset = queryset.filter(Q(descricao__icontains=search_text))

        paginator = Paginator(queryset, page_size)
        
        try:
            page_obj = paginator.page(current_page)
        except:
            return Response({
                "items": [],
                "total": paginator.count,
                "message": "Página não encontrada"
            }, status=status.HTTP_400_BAD_REQUEST)

        items_serializer = TurmaSerializer(page_obj.object_list, many=True)

        return Response({
            "items": items_serializer.data,
            "total": paginator.count,
            "currentPage": page_obj.number,
            "pageSize": int(page_size),
            "totalPages": paginator.num_pages
        })

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else FileNotFoundError
        serializer.save(created_by=user, updated_by=user)

    def perform_update(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(updated_by=user)

    def get_serializer_class(self):
        if self.action == 'listar_paginado': # Nome da sua função decorada com @action
            return TurmaListagemSerializer
        return TurmaSerializer