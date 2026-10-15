from rest_framework import viewsets, permissions, filters
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'summary', 'content', 'author', 'category']
    ordering_fields = ['created_at', 'title']

    def get_queryset(self):
        # Allow admin queries to see all, anonymous to see published
        if self.request.user.is_authenticated and (getattr(self.request.user, 'role', '') == 'ADMIN' or self.request.user.is_staff):
            return Article.objects.all()
        # In dev/demo admin panel, allow list all or query param ?all=true
        if self.request.query_params.get('all') == 'true':
            return Article.objects.all()
        return Article.objects.filter(is_published=True)

    def get_permissions(self):
        # Allow view and admin actions
        return [permissions.AllowAny()]
