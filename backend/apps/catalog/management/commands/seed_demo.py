from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.catalog.models import Category, Product, ProductSize
from apps.promos.models import PromoCode

User = get_user_model()

CATEGORIES = [
    {"slug": "all", "name": "All Products"},
    {"slug": "bar-soaps", "name": "Bar Soaps"},
    {"slug": "liquid-detergents", "name": "Liquid Detergents"},
    {"slug": "hand-wash", "name": "Hand Wash Liquid Soaps"},
    {"slug": "bleaching-agents", "name": "Bleaching Agents"},
    {"slug": "bio-digester", "name": "Bio-digester Chemicals"},
    {"slug": "powdered-detergents", "name": "Powdered Detergents"},
    {"slug": "air-fresheners", "name": "Air Fresheners"},
    {"slug": "skin-care", "name": "Skin Care Products"},
    {"slug": "hair-care", "name": "Shampoos & Conditioners"}
]

PRODUCTS = [
    {
        "slug": "batian-multi-bar",
        "name": "Batian Multipurpose Botanical Bar Soap",
        "brand_line": "Batian",
        "category_slug": "bar-soaps",
        "badge": "Flagship Bestseller",
        "is_flagship": True,
        "rating": 4.90,
        "reviews_count": 142,
        "short_description": "Kenya's trusted high-foaming cleaning & laundry bar infused with Aberdare mountain pine and natural vegetable oils.",
        "full_description": "Named after Mount Kenya's highest peak, Batian is engineered for Kenyan homes and commercial institutions. Its dense, triple-milled structure resists mushiness in soap trays and provides unmatched grease-cutting power in hard or borehole water.",
        "base_price": 180,
        "default_size": "250g",
        "image": "https://images.unsplash.com/photo-1607006311600-314b3b4d83ff?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A+",
        "benefits": [
            "Rich dense lather even in cold & borehole water",
            "Gentle on hands, ruthless on fabric grease",
            "Triple-milled to outlast standard supermarket bars by 40%",
            "Biodegradable formulation safe for greywater garden use"
        ],
        "ingredients": "Saponified African Palm Oil, Aberdare Mountain Pine Extract, Coconut Oil Fatty Acids, Glycerin, Sodium Silicate, Natural Chlorophyll.",
        "sizes": [
            {"label": "100g", "price": 75, "segment": "Daily Personal Bath"},
            {"label": "150g", "price": 105, "segment": "Compact Family Size"},
            {"label": "250g", "price": 180, "segment": "Everyday Multipurpose"},
            {"label": "500g", "price": 260, "segment": "Heavy-Duty Laundry Block"},
            {"label": "800g", "price": 360, "segment": "Long-Life Utility Bar"},
            {"label": "1kg", "price": 450, "segment": "Industrial Master Block"}
        ]
    },
    {
        "slug": "lisa-lux-beauty-bar",
        "name": "Lisa Lux Highland Aloe & Hibiscus Beauty Bar",
        "brand_line": "Lisa Lux",
        "category_slug": "bar-soaps",
        "badge": "Luxury Skincare",
        "is_flagship": True,
        "rating": 4.95,
        "reviews_count": 218,
        "short_description": "Creamy cold-pressed luxury bathing bar combining freshly pressed Aberdare aloe vera gel and wild hibiscus flower extract.",
        "full_description": "Lisa Lux is the epitome of our 'Nature Meets Innovation' philosophy. Sourced from high-altitude smallholder cooperatives on the slopes of the Aberdare mountain range, raw aloe vera soothes sensitive skin while hibiscus provides gentle rejuvenation.",
        "base_price": 160,
        "default_size": "200g",
        "image": "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A+",
        "benefits": [
            "Pure Aberdare Highland Aloe Vera hydrates dry skin",
            "Natural Hibiscus flower antioxidants enhance skin elasticity",
            "Free of harsh parabens, phthalates, and synthetic sulfates",
            "Suitable for all skin types, eczema-prone skin, and children"
        ],
        "ingredients": "Cold-Pressed Olive & Coconut Oil, Cold-Filtered Aloe Barbadensis Leaf Juice, Hibiscus Sabdariffa Extract, Shea Butter, Vitamin E, Essential Jasmine Oil.",
        "sizes": [
            {"label": "15g", "price": 20, "segment": "Luxury Hotel & Airbnb Amenity"},
            {"label": "25g", "price": 30, "segment": "Travel & Gym Sachet"},
            {"label": "50g", "price": 45, "segment": "Children & Sensitive Facial"},
            {"label": "100g", "price": 95, "segment": "Daily Radiance Bath Bar"},
            {"label": "200g", "price": 160, "segment": "Triple-Milled Luxury Bar"}
        ]
    },
    {
        "slug": "aberdare-ultra-liquid-detergent",
        "name": "Aberdares Pure Clean Multi-Action Liquid Detergent",
        "brand_line": "Aberdares Pure",
        "category_slug": "liquid-detergents",
        "badge": "High Efficiency",
        "is_flagship": False,
        "rating": 4.88,
        "reviews_count": 84,
        "short_description": "Concentrated enzyme-powered liquid detergent for machine & hand wash. Tough on collar dirt, soft on fabrics.",
        "full_description": "Formulated in our Ruiru laboratories, this phosphate-free formula dissolves instantly in cold water. Contains bio-enzymes that break down proteins, grease, and soil without weakening cotton fibres.",
        "base_price": 380,
        "default_size": "1 Litre",
        "image": "https://images.unsplash.com/photo-1585837575652-267c041d77d4?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A+",
        "benefits": [
            "High Efficiency (HE) — compatible with top & front load washers",
            "Zero residue on dark clothes and vibrant Kitenge fabrics",
            "Low foam formula saves water during rinse cycles"
        ],
        "ingredients": "Biodegradable Surfactants, Natural Protease & Amylase Enzymes, Softening Conditioners, Mountain Lavender Oil.",
        "sizes": [
            {"label": "1 Litre", "price": 380, "segment": "Standard Bottle"},
            {"label": "2 Litres", "price": 690, "segment": "Family Value Bottle"},
            {"label": "5 Litres", "price": 1450, "segment": "Economy Jerrycan"},
            {"label": "20 Litres", "price": 4800, "segment": "Commercial / Laundromat Drum"}
        ]
    }
]

PROMOS = [
    {
        "code": "KARIBU10",
        "promo_type": PromoCode.PromoType.PERCENTAGE,
        "value": 10,
        "free_delivery": False,
        "description": "10% Welcome Discount applied!"
    },
    {
        "code": "ABERDARE",
        "promo_type": PromoCode.PromoType.PERCENTAGE,
        "value": 0,
        "free_delivery": True,
        "description": "Free Nairobi/Kiambu Delivery applied!"
    },
    {
        "code": "GREEN20",
        "promo_type": PromoCode.PromoType.PERCENTAGE,
        "value": 20,
        "free_delivery": False,
        "description": "20% Eco-Hero Loyalty Discount applied!"
    }
]

class Command(BaseCommand):
    help = "Seeds demo catalog products matching React frontend mock data, demo admin user, and promo codes."

    def handle(self, *args, **options):
        self.stdout.write("Seeding Aberdares E-Commerce demo database...")

        # 1. Admin user
        admin_email = "admin@aberdares.co.ke"
        if not User.objects.filter(email=admin_email).exists():
            admin_user = User.objects.create_superuser(
                email=admin_email,
                password="AberdaresAdminPassword2026!",
                name="Aberdares Admin",
                phone="+254712792555"
            )
            self.stdout.write(self.style.SUCCESS(f"Created admin user: {admin_email} / AberdaresAdminPassword2026!"))

        # 2. Categories
        cat_map = {}
        for c in CATEGORIES:
            cat, _ = Category.objects.get_or_create(slug=c["slug"], defaults={"name": c["name"]})
            cat_map[c["slug"]] = cat

        # 3. Products & Sizes
        for p_data in PRODUCTS:
            sizes = p_data.pop("sizes")
            cat_slug = p_data.pop("category_slug")
            p_data["category"] = cat_map.get(cat_slug, cat_map["bar-soaps"])

            product, created = Product.objects.update_or_create(slug=p_data["slug"], defaults=p_data)
            action = "Created" if created else "Updated"
            self.stdout.write(f"{action} product: {product.name}")

            for s in sizes:
                ProductSize.objects.update_or_create(
                    product=product,
                    label=s["label"],
                    defaults={"price": s["price"], "segment": s.get("segment", "")}
                )

        # 4. Promo codes
        for promo in PROMOS:
            p_code, _ = PromoCode.objects.update_or_create(code=promo["code"], defaults=promo)
            self.stdout.write(f"Configured Promo Code: {p_code.code}")

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
