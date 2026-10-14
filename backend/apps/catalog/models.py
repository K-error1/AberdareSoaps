from django.db import models
from apps.core.models import TimeStampedUUIDModel

class Category(TimeStampedUUIDModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=100, db_index=True)
    description = models.TextField(blank=True, default='')

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

class Product(TimeStampedUUIDModel):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255, db_index=True)
    brand_line = models.CharField(max_length=100, db_index=True) # e.g. Batian, Lisa Lux, Elsie Suds, Aberdares Pure
    badge = models.CharField(max_length=100, blank=True, default='') # Flagship Bestseller, etc.
    is_flagship = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    reviews_count = models.PositiveIntegerField(default=0)
    short_description = models.TextField()
    full_description = models.TextField()
    base_price = models.PositiveIntegerField(help_text="Whole KES integer")
    default_size = models.CharField(max_length=50, default='Standard')
    benefits = models.JSONField(default=list, blank=True)
    ingredients = models.TextField(blank=True, default='')
    image = models.URLField(max_length=500)
    in_stock = models.BooleanField(default=True)
    stock_quantity = models.PositiveIntegerField(default=100)
    reserved_quantity = models.PositiveIntegerField(default=0)
    eco_score = models.CharField(max_length=10, blank=True, default='A')
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-is_flagship', '-created_at']

    def __str__(self):
        return f"{self.name} ({self.brand_line})"

    @property
    def available_stock(self):
        return max(0, self.stock_quantity - self.reserved_quantity)

class ProductSize(TimeStampedUUIDModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sizes')
    label = models.CharField(max_length=50) # e.g. 250g, 500g, 1 Litre, 5 Litres
    price = models.PositiveIntegerField(help_text="Whole KES integer")
    segment = models.CharField(max_length=150, blank=True, default='')
    stock_quantity = models.PositiveIntegerField(default=100)
    reserved_quantity = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('product', 'label')
        ordering = ['price']

    def __str__(self):
        return f"{self.product.name} - {self.label} (KES {self.price})"

    @property
    def available_stock(self):
        return max(0, self.stock_quantity - self.reserved_quantity)
