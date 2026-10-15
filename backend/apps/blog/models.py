from django.db import models
from apps.core.models import TimeStampedUUIDModel

class Article(TimeStampedUUIDModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255, db_index=True)
    category = models.CharField(max_length=100)
    read_time = models.CharField(max_length=50, default='5 min read')
    date_display = models.CharField(max_length=100, blank=True, default='')
    author = models.CharField(max_length=150)
    summary = models.TextField()
    content = models.TextField()
    image = models.URLField(max_length=500)
    tags = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
