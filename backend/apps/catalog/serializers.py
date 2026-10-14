from rest_framework import serializers
from .models import Category, Product, ProductSize

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description')

class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ('id', 'label', 'price', 'segment', 'stock_quantity', 'available_stock')

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='slug', queryset=Category.objects.all())
    category_name = serializers.CharField(source='category.name', read_only=True)
    sizes = ProductSizeSerializer(many=True, read_only=True)

    # Alias fields to match existing React frontend expectations
    brandLine = serializers.CharField(source='brand_line')
    isFlagship = serializers.BooleanField(source='is_flagship')
    reviewsCount = serializers.IntegerField(source='reviews_count')
    shortDescription = serializers.CharField(source='short_description')
    fullDescription = serializers.CharField(source='full_description')
    basePrice = serializers.IntegerField(source='base_price')
    defaultSize = serializers.CharField(source='default_size')
    inStock = serializers.BooleanField(source='in_stock')
    ecoScore = serializers.CharField(source='eco_score')

    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'slug',
            'brandLine',
            'category',
            'category_name',
            'badge',
            'isFlagship',
            'rating',
            'reviewsCount',
            'shortDescription',
            'fullDescription',
            'basePrice',
            'defaultSize',
            'sizes',
            'benefits',
            'ingredients',
            'image',
            'inStock',
            'available_stock',
            'ecoScore',
            'is_active',
            'created_at'
        )
