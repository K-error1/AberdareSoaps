from django.contrib import admin
from django.utils.html import format_html
from apps.accounts.models import User
from apps.catalog.models import Category, Product, ProductSize
from apps.orders.models import Order, OrderItem, OrderStatusHistory
from apps.payments.models import Payment, WebhookEvent
from apps.promos.models import PromoCode
from apps.loyalty.models import LoyaltyLedger

# Accounts
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'phone', 'role', 'is_active', 'created_at')
    list_filter = ('role', 'is_active')
    search_fields = ('email', 'name', 'phone')

# Catalog
class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand_line', 'category', 'base_price', 'stock_quantity', 'reserved_quantity', 'in_stock', 'is_flagship')
    list_filter = ('category', 'brand_line', 'is_flagship', 'in_stock')
    search_fields = ('name', 'slug', 'brand_line')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductSizeInline]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

# Orders
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ('product', 'product_name_snapshot', 'size_label', 'unit_price_snapshot', 'quantity', 'line_total')
    extra = 0
    can_delete = False

class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    readonly_fields = ('from_status', 'to_status', 'changed_by', 'notes', 'created_at')
    extra = 0
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer_name', 'customer_phone', 'status', 'total', 'payment_method', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_method', 'payment_status', 'delivery_option', 'created_at')
    search_fields = ('order_number', 'customer_name', 'customer_phone', 'mpesa_receipt_number')
    readonly_fields = ('order_number', 'subtotal', 'discount_amount', 'delivery_fee', 'total', 'created_at', 'updated_at')
    inlines = [OrderItemInline, OrderStatusHistoryInline]

    actions = ['mark_as_processing', 'mark_as_out_for_delivery', 'mark_as_delivered']

    def mark_as_processing(self, request, queryset):
        queryset.update(status=Order.Status.PROCESSING)
    mark_as_processing.short_description = "Advance selected to Processing"

    def mark_as_out_for_delivery(self, request, queryset):
        queryset.update(status=Order.Status.OUT_FOR_DELIVERY)
    mark_as_out_for_delivery.short_description = "Advance selected to Out for Delivery"

    def mark_as_delivered(self, request, queryset):
        queryset.update(status=Order.Status.DELIVERED)
    mark_as_delivered.short_description = "Advance selected to Delivered"

# Payments
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order', 'provider', 'amount', 'status', 'mpesa_receipt_number', 'created_at')
    list_filter = ('provider', 'status', 'created_at')
    search_fields = ('mpesa_receipt_number', 'mpesa_checkout_request_id', 'order__order_number')

@admin.register(WebhookEvent)
class WebhookEventAdmin(admin.ModelAdmin):
    list_display = ('provider', 'event_id', 'is_processed', 'created_at')
    list_filter = ('provider', 'is_processed')

# Promos & Loyalty
@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'promo_type', 'value', 'used_count', 'max_uses', 'is_active', 'expires_at')
    list_filter = ('promo_type', 'is_active')
    search_fields = ('code',)

@admin.register(LoyaltyLedger)
class LoyaltyLedgerAdmin(admin.ModelAdmin):
    list_display = ('user', 'order', 'points', 'transaction_type', 'balance_after', 'created_at')
    list_filter = ('transaction_type', 'created_at')
    search_fields = ('user__email', 'order__order_number')
