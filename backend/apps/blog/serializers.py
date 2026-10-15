from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)
    readTime = serializers.CharField(source='read_time', required=False, allow_blank=True)
    date = serializers.CharField(source='date_display', required=False, allow_blank=True)

    class Meta:
        model = Article
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'readTime',
            'date',
            'author',
            'summary',
            'content',
            'image',
            'tags',
            'is_published',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        if not validated_data.get('slug'):
            from django.utils.text import slugify
            title = validated_data.get('title', '')
            base_slug = slugify(title)
            validated_data['slug'] = f"{base_slug}-{Article.objects.count() + 1}"
        return super().create(validated_data)
