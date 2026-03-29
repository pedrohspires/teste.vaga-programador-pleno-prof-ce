from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.core.paginator import Paginator
from app.core.models.atividade import Atividade
from app.core.serializers.atividade import AtividadeSerializer
from app.core.permissions import IsProfessor

class AtividadeViewSet(viewsets.ModelViewSet):
    queryset = Atividade.objects.all()
    serializer_class = AtividadeSerializer
    permission_classes = [IsProfessor]

    @action(detail=False, methods=['post'], url_path='listagem')
    def listar_paginado(self, request):
        current_page = request.data.get('currentPage', 1)
        page_size = request.data.get('pageSize', 10)
        search_text = request.data.get('search', '')
        turma_id = request.data.get('id_turma')

        queryset = self.get_queryset().order_by('-created_at')

        if search_text:
            queryset = queryset.filter(
                Q(titulo__icontains=search_text) | 
                Q(descricao__icontains=search_text)
            )
        
        if turma_id:
            queryset = queryset.filter(turma_id=turma_id)

        paginator = Paginator(queryset, page_size)
        
        try:
            page_obj = paginator.page(current_page)
        except:
            return Response({
                "items": [],
                "total": paginator.count,
                "message": "Página não encontrada"
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(page_obj.object_list, many=True)

        return Response({
            "items": serializer.data,
            "total": paginator.count,
            "currentPage": page_obj.number,
            "pageSize": int(page_size),
            "totalPages": paginator.num_pages
        })

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user, updated_by=user)

    def perform_update(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(updated_by=user)