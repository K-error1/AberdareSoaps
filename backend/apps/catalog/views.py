from rest_framework import viewsets, permissions, filters, views, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductSize
from .serializers import CategorySerializer, ProductSerializer, ProductSizeSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'brand_line', 'is_flagship']
    search_fields = ['name', 'short_description', 'brand_line', 'ingredients']
    ordering_fields = ['base_price', 'rating', 'created_at']

    def get_queryset(self):
        # For detail actions (retrieve, update, adjust-inventory) or admin queries (?inventory=all or ?all=true):
        # include all active products so depleted ones can be viewed and restocked
        if self.action != 'list' or self.request.query_params.get('inventory') == 'all' or self.request.query_params.get('all') == 'true':
            return Product.objects.filter(is_active=True).prefetch_related('sizes', 'category')
        # Public Sales Products catalog: ONLY in-stock products with available inventory > 0
        return Product.objects.filter(is_active=True, in_stock=True, stock_quantity__gt=0).prefetch_related('sizes', 'category')

    def get_permissions(self):
        return [permissions.AllowAny()]

    @action(detail=True, methods=['patch', 'post'], url_path='adjust-inventory')
    def adjust_inventory(self, request, slug=None):
        product = self.get_object()
        new_quantity = request.data.get('stock_quantity')
        add_stock = request.data.get('add_stock')

        if new_quantity is not None:
            product.stock_quantity = max(0, int(new_quantity))
        elif add_stock is not None:
            product.stock_quantity = max(0, product.stock_quantity + int(add_stock))

        # Auto-sync in_stock: if stock > 0, product is live on sale; if 0, removed from sale
        product.in_stock = (product.stock_quantity > 0)
        product.save()

        return Response(ProductSerializer(product).data)

class BarSoapSizeMatrixView(views.APIView):
    """
    Direct API endpoint serving the 15g to 1kg bar soap size spectrum matrix,
    matching the frontend Bar Soap Size Guide view.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        sizes = [
            {"weight": "15g", "category": "Hotel & Hospitality Guest Amenity", "marketSegment": "Safari Lodges & Boutique Hotels", "retailPrice": 20, "cartonQty": "500 pcs/ctn", "recommendedVariant": "Lisa Lux™ Highland Botanical Guest Bar", "useCase": "Single-use luxury bath & vanity bar for guests."},
            {"weight": "25g", "category": "Travel & Hospitality Mini Bar", "marketSegment": "Hotels, Airbnbs & Gym Kits", "retailPrice": 30, "cartonQty": "400 pcs/ctn", "recommendedVariant": "Lisa Lux™ Aloe & Hibiscus Travel Bar", "useCase": "Multi-day hospitality bar for weekend stays."},
            {"weight": "50g", "category": "Facial & Sensitive Skin Bar", "marketSegment": "Everyday Facial Cleanse", "retailPrice": 45, "cartonQty": "200 pcs/ctn", "recommendedVariant": "Lisa Lux™ Pure Highland Facial Soap", "useCase": "Gentle daily hand & facial cleansing bar."},
            {"weight": "100g", "category": "Standard Personal Bath Bar", "marketSegment": "General Household Toilet Soap", "retailPrice": 75, "cartonQty": "100 pcs/ctn", "recommendedVariant": "Batian™ Mountain Pine Toilet Bar", "useCase": "Everyday family bath bar with dense lather."},
            {"weight": "150g", "category": "Compact Household & Laundry Bar", "marketSegment": "Budget Family Laundry & Kitchen Sink", "retailPrice": 105, "cartonQty": "72 pcs/ctn", "recommendedVariant": "Batian™ Multi-Wash Compact Bar", "useCase": "Quick basin laundry, handwashing and dish sink."},
            {"weight": "200g", "category": "Luxury Triple-Milled Bath Bar", "marketSegment": "Premium Skincare & Body Wash", "retailPrice": 160, "cartonQty": "60 pcs/ctn", "recommendedVariant": "Lisa Lux™ Highland Aloe & Hibiscus Beauty Bar", "useCase": "Moisturizing full-body bath bar."},
            {"weight": "250g", "category": "Multipurpose Everyday Bar", "marketSegment": "Household Flagship Staple", "retailPrice": 180, "cartonQty": "48 pcs/ctn", "recommendedVariant": "Batian™ Multipurpose Botanical Bar Soap", "useCase": "Kenya's classic all-around laundry and cleaning bar."},
            {"weight": "500g", "category": "Heavy-Duty Laundry Block", "marketSegment": "Large Household & Handwash Laundry", "retailPrice": 260, "cartonQty": "24 pcs/ctn", "recommendedVariant": "Elsie Suds™ Ultra-Foam Laundry Bar", "useCase": "Tough stain removal on uniforms, collars and rugs."},
            {"weight": "800g", "category": "Long-Life Utility Bar", "marketSegment": "Rural & High-Volume Laundry", "retailPrice": 360, "cartonQty": "16 pcs/ctn", "recommendedVariant": "Batian™ Master Utility Laundry Bar", "useCase": "Extended longevity block resistant to dissolving in water bowls."},
            {"weight": "1kg", "category": "Industrial Master Block", "marketSegment": "Schools, Laundromats & Bulk Buyers", "retailPrice": 450, "cartonQty": "12 pcs/ctn", "recommendedVariant": "Batian™ Industrial Strength Clean Block", "useCase": "Heavy institutional laundry and commercial kitchens."}
        ]
        return Response(sizes)
