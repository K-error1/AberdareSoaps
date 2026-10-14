import pytest
from rest_framework.test import APIClient
from apps.catalog.models import Category, Product, ProductSize
from apps.promos.models import PromoCode
from apps.orders.models import Order
from apps.payments.models import Payment

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def sample_category(db):
    return Category.objects.create(name="Bar Soaps", slug="bar-soaps")

@pytest.fixture
def sample_product(db, sample_category):
    prod = Product.objects.create(
        name="Batian Soap",
        slug="batian-multi-bar",
        brand_line="Batian",
        category=sample_category,
        base_price=180,
        stock_quantity=50
    )
    ProductSize.objects.create(product=prod, label="250g", price=180, stock_quantity=50)
    return prod

@pytest.fixture
def sample_promo(db):
    return PromoCode.objects.create(
        code="KARIBU10",
        promo_type=PromoCode.PromoType.PERCENTAGE,
        value=10,
        is_active=True
    )

@pytest.mark.django_db
def test_create_order_recalculates_price_and_locks_stock(api_client, sample_product):
    payload = {
        "items": [
            {"product_id": sample_product.slug, "size": "250g", "quantity": 2}
        ],
        "fullName": "Jane Wambui",
        "phone": "0712792555",
        "email": "jane@example.com",
        "address": "Rhapta Road, Westlands",
        "deliveryOption": "nairobi",
        "paymentMethod": "mpesa"
    }

    res = api_client.post("/api/orders/", payload, format="json")
    assert res.status_code == 201
    data = res.json()
    assert data["customerName"] == "Jane Wambui"
    assert data["subtotal"] == 360 # 180 * 2
    assert data["delivery_fee"] == 250 # < 3000 threshold
    assert data["total"] == 610 # 360 + 250
    assert "guest_access_token" in data

    # Verify stock reservation
    size_obj = sample_product.sizes.first()
    size_obj.refresh_from_db()
    assert size_obj.reserved_quantity == 2
    assert size_obj.available_stock == 48

@pytest.mark.django_db
def test_promo_code_validation(api_client, sample_promo):
    payload = {
        "code": "KARIBU10",
        "subtotal": 1000,
        "delivery_fee": 250
    }
    res = api_client.post("/api/promos/validate/", payload, format="json")
    assert res.status_code == 200
    data = res.json()
    assert data["code"] == "KARIBU10"
    assert data["discount"] == 100 # 10% of 1000
