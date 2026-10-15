from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.catalog.models import Category, Product, ProductSize
from apps.promos.models import PromoCode
from apps.blog.models import Article

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
        "full_description": "Lisa Lux is the epitome of our 'Nature Meets Innovation' philosophy. Sourced from high-altitude smallholder cooperatives on the slopes of the Aberdare mountain range, raw aloe vera soothes sensitive skin while hibiscus provides gentle alpha-hydroxy rejuvenation.",
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
        "slug": "elsie-suds-laundry-bar",
        "name": "Elsie Suds Ultra-Foam Laundry & Dishwashing Bar",
        "brand_line": "Elsie Suds",
        "category_slug": "bar-soaps",
        "badge": "Super Whitener",
        "is_flagship": True,
        "rating": 4.85,
        "reviews_count": 96,
        "short_description": "High-suds oxygenated washing bar formulated for stubborn Kenyan red soil stains, grease, and cookware shine.",
        "full_description": "Elsie Suds delivers effortless stain lifting without burning or drying your skin. Perfect for soaking school uniforms, kitchen cloths, and delicate hand-wash fabrics, it leaves clothes smelling alpine-fresh and naturally bright.",
        "base_price": 260,
        "default_size": "500g",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A",
        "benefits": [
            "Active oxygen brighteners remove tough red clay & oil stains",
            "Sparkling finish on aluminum and stainless cookware",
            "Skin-comforting coconut glycerin prevents finger irritation",
            "Ultra-compact formulation resists dissolving in water bowls"
        ],
        "ingredients": "Plant-derived Surfactants, Sodium Carbonate, Coconut Fatty Acid Extract, Optical Brightening Minerals, Mountain Lemon Essence.",
        "sizes": [
            {"label": "150g", "price": 105, "segment": "Handy Kitchen Sink Bar"},
            {"label": "250g", "price": 170, "segment": "Household Daily Laundry"},
            {"label": "500g", "price": 260, "segment": "Heavy-Duty Stain Eraser Block"},
            {"label": "1kg", "price": 440, "segment": "Institutional Wash Block"}
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
    },
    {
        "slug": "aberdare-dishwash-liquid",
        "name": "Aberdares Sparkle Citrus Dishwashing Liquid",
        "brand_line": "Aberdares Pure",
        "category_slug": "liquid-detergents",
        "badge": "Grease Stripper",
        "is_flagship": False,
        "rating": 4.90,
        "reviews_count": 110,
        "short_description": "Thick, grease-dissolving dish liquid with real lemon peel extract and skin-conditioning aloe.",
        "full_description": "A few concentrated drops slice straight through cooking oil, beef stew residue, and ugali starch on pots and cutlery. Leaves glassware streak-free with no chemical smell.",
        "base_price": 220,
        "default_size": "750ml",
        "image": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A",
        "benefits": [
            "1 drop cleans up to 5 plates with instant degreasing",
            "Infused with Aberdare aloe vera to keep hands soft",
            "Neutral pH formula doesn't etch glassware or porcelain"
        ],
        "ingredients": "Sodium Laureth Sulfate, Cocamidopropyl Betaine, Citrus Limon Extract, Aberdare Aloe Vera Gel.",
        "sizes": [
            {"label": "500ml", "price": 160, "segment": "Flip-top Dispenser"},
            {"label": "750ml", "price": 220, "segment": "Pump Bottle"},
            {"label": "5 Litres", "price": 1150, "segment": "Restaurant & Catering Jerrycan"},
            {"label": "20 Litres", "price": 3900, "segment": "Hospitality Bulk Drum"}
        ]
    },
    {
        "slug": "aloe-hibiscus-handwash",
        "name": "Aberdares Botanicals Aloe Vera & Hibiscus Hand Wash",
        "brand_line": "Lisa Lux",
        "category_slug": "hand-wash",
        "badge": "Aloe Vera Enriched",
        "is_flagship": False,
        "rating": 4.96,
        "reviews_count": 164,
        "short_description": "Ultra-moisturizing antibacterial hand wash infused with 100% pure organic Aberdare Aloe Vera and floral hibiscus.",
        "full_description": "Repeated hand washing shouldn't strip your skin's moisture barrier. Our soothing formula blends natural antibacterial botanical extracts with organic aloe vera juice.",
        "base_price": 290,
        "default_size": "500ml",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A+",
        "benefits": [
            "Kills 99.9% of bacteria and germs naturally",
            "Enriched with 30% organic cold-filtered Aloe Vera gel",
            "Silky velvet lather with refreshing botanical fragrance"
        ],
        "ingredients": "Aqua, Aberdare Aloe Barbadensis Juice, Hibiscus Sabdariffa Extract, Glycerin, Coco-Glucoside.",
        "sizes": [
            {"label": "300ml", "price": 210, "segment": "Designer Countertop Pump"},
            {"label": "500ml", "price": 290, "segment": "Family Pump Bottle"},
            {"label": "5 Litres", "price": 1350, "segment": "Refill Jerrycan for Offices"},
            {"label": "20 Litres", "price": 4400, "segment": "Corporate & Hotel Refill Drum"}
        ]
    },
    {
        "slug": "tea-tree-eucalyptus-handwash",
        "name": "Aberdares Defense Tea Tree & Eucalyptus Antibacterial Hand Wash",
        "brand_line": "Aberdares Pure",
        "category_slug": "hand-wash",
        "badge": "Hospital Grade",
        "is_flagship": False,
        "rating": 4.82,
        "reviews_count": 76,
        "short_description": "Clinical-grade hygiene hand wash with antiseptic tea tree oil, cooling eucalyptus, and hydrating glycerin.",
        "full_description": "Developed for medical clinics, commercial kitchens, food processing plants, and high-traffic washrooms where hygiene cannot be compromised.",
        "base_price": 320,
        "default_size": "500ml",
        "image": "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A",
        "benefits": [
            "Maximum germicidal efficacy without drying skin",
            "Crisp eucalyptus odor neutralizer",
            "Certified KEBS standard compliance"
        ],
        "ingredients": "Aqua, Melaleuca Alternifolia (Tea Tree) Oil, Eucalyptus Globulus Leaf Oil, Glycerin, Mild Biocides.",
        "sizes": [
            {"label": "500ml", "price": 320, "segment": "Clinic / Kitchen Pump"},
            {"label": "5 Litres", "price": 1550, "segment": "Commercial Dispenser Refill"},
            {"label": "20 Litres", "price": 4950, "segment": "Bulk Facility Jerrycan"}
        ]
    },
    {
        "slug": "aberdare-power-bleach-regular",
        "name": "Aberdares Max-Guard Sodium Hypochlorite Disinfectant Bleach",
        "brand_line": "Aberdares Pure",
        "category_slug": "bleaching-agents",
        "badge": "Disinfectant & Whitener",
        "is_flagship": False,
        "rating": 4.87,
        "reviews_count": 52,
        "short_description": "Heavy-duty commercial sanitizing bleach for hospital-level surface disinfection, white linens, and sanitation.",
        "full_description": "Stable 5.25% sodium hypochlorite formulation for killing pathogens, mildew, mold, and neutralizing bad drainage odors.",
        "base_price": 150,
        "default_size": "750ml",
        "image": "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80",
        "eco_score": "B+",
        "benefits": [
            "Kills 99.99% of bacteria, viruses, fungi, and spores",
            "Restores brilliant whites to hospital bedding and lab coats",
            "Safety vented cap on bulk containers"
        ],
        "ingredients": "Active Sodium Hypochlorite (5.25%), Sodium Hydroxide stabilizer, Deionized Water.",
        "sizes": [
            {"label": "750ml", "price": 150, "segment": "Child-Lock Safety Bottle"},
            {"label": "2 Litres", "price": 340, "segment": "Domestic Value Bottle"},
            {"label": "5 Litres", "price": 680, "segment": "Institutional Jerrycan"},
            {"label": "20 Litres", "price": 2300, "segment": "Commercial Sanitation Drum"}
        ]
    },
    {
        "slug": "aberdare-colorsafe-oxygen-bleach",
        "name": "Aberdares ColorSafe Oxygen Bleach & Stain Booster",
        "brand_line": "Elsie Suds",
        "category_slug": "bleaching-agents",
        "badge": "Fabric Safe",
        "is_flagship": False,
        "rating": 4.91,
        "reviews_count": 68,
        "short_description": "Chlorine-free active oxygen bleaching liquid safe for all colored fabrics, baby clothes, and delicate curtains.",
        "full_description": "Harnesses hydrogen peroxide micro-bubbles to lift wine, coffee, mud, and collar perspiration without weakening fibers.",
        "base_price": 280,
        "default_size": "1 Litre",
        "image": "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A+",
        "benefits": [
            "100% Chlorine-free: Will not bleach out bright colors",
            "Safe on school blazers, bed covers, and sport jerseys",
            "Breaks down into pure water and oxygen"
        ],
        "ingredients": "Hydrogen Peroxide stabilized complex, Non-ionic Surfactant, Fragrance Stabilizer.",
        "sizes": [
            {"label": "1 Litre", "price": 280, "segment": "Laundry Booster"},
            {"label": "5 Litres", "price": 1200, "segment": "Hotel Laundry Refill"}
        ]
    },
    {
        "slug": "aberdare-biodigester-activator",
        "name": "Aberdares Eco-Flow Bio-Digester Bacterial Catalyst",
        "brand_line": "Aberdares Pure",
        "category_slug": "bio-digester",
        "badge": "Eco-Active Bio Enzyme",
        "is_flagship": False,
        "rating": 4.97,
        "reviews_count": 189,
        "short_description": "Concentrated microbial inoculant for septic tanks, pit latrines, bio-digesters, and soak pits.",
        "full_description": "Engineered specifically for Kenyan residential and institutional waste systems. Liquefies solid waste, degrades fat, oil & grease (FOG), and eliminates foul odors.",
        "base_price": 950,
        "default_size": "1kg Powder",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A++",
        "benefits": [
            "Rapidly breaks down human sludge, toilet paper, and fats",
            "Permanently clears offensive sewage and drain odors",
            "Saves up to KSh 30,000 annually in exhauster pumping fees"
        ],
        "ingredients": "Multi-strain Bacillus dormant spore consortium, Lipase, Cellulase, Protease enzymes.",
        "sizes": [
            {"label": "1kg Powder", "price": 950, "segment": "Quarterly Household Dose"},
            {"label": "2 Litres Liquid", "price": 1750, "segment": "Semi-Annual Tank Shock Treatment"},
            {"label": "5kg Bucket", "price": 3900, "segment": "Schools, Apartments & Estates"},
            {"label": "20kg Drum", "price": 13500, "segment": "Hotel Resorts & Hospitals"}
        ]
    },
    {
        "slug": "aberdare-drain-unblocker-enzyme",
        "name": "Aberdares Bio-Clog Enzyme Drain & Grease-Trap Digester",
        "brand_line": "Aberdares Pure",
        "category_slug": "bio-digester",
        "badge": "Pipe Safe",
        "is_flagship": False,
        "rating": 4.86,
        "reviews_count": 63,
        "short_description": "Non-corrosive natural bacterial degreaser for hotel grease traps, kitchen sinks, and restaurant drains.",
        "full_description": "Bio-Clog feeds directly on grease and soap scum, converting it into harmless carbon dioxide and water without damaging pipes.",
        "base_price": 650,
        "default_size": "1 Litre",
        "image": "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A+",
        "benefits": [
            "Will not heat, crack, or damage PVC or metal drainage pipes",
            "Restores full drain flow speed in commercial kitchens",
            "Zero toxic fumes — completely safe around food prep areas"
        ],
        "ingredients": "Active Bacterial Cultures, Lipolytic Enzymes, Natural Bio-Surfactants, Peppermint Extract.",
        "sizes": [
            {"label": "1 Litre", "price": 650, "segment": "Kitchen Drain Bottle"},
            {"label": "5 Litres", "price": 2600, "segment": "Hotel Grease Trap Treatment"}
        ]
    },
    {
        "slug": "batian-power-washing-powder",
        "name": "Batian Active-Enzyme High Foam Washing Powder",
        "brand_line": "Batian",
        "category_slug": "powdered-detergents",
        "badge": "Deep Clean",
        "is_flagship": True,
        "rating": 4.88,
        "reviews_count": 135,
        "short_description": "Concentrated washing powder with stain-lifting oxygen pearls and long-lasting mountain flower freshness.",
        "full_description": "Specially formulated for Kenyan hand washing and washing machines. Dense, fragrant foam lifts deep grime from school white socks without harsh abrasives.",
        "base_price": 240,
        "default_size": "1kg",
        "image": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A",
        "benefits": [
            "Instant mountain flower scent that lasts on clothes for 7+ days",
            "Micro-granules dissolve immediately without leaving white chalk streaks",
            "Enhanced foaming action optimized for borehole & tap water"
        ],
        "ingredients": "Sodium Alkylbenzene Sulfonate, Sodium Carbonate, Stain-Releasing Enzymes, Mountain Bloom Perfume.",
        "sizes": [
            {"label": "500g", "price": 130, "segment": "Compact Pack"},
            {"label": "1kg", "price": 240, "segment": "Family Size"},
            {"label": "3.5kg", "price": 780, "segment": "Value Bucket with Scoop"},
            {"label": "10kg", "price": 2100, "segment": "Institutional Sack"},
            {"label": "25kg", "price": 4800, "segment": "Commercial Bulk Sack"}
        ]
    },
    {
        "slug": "aberdare-highland-jasmine-spray",
        "name": "Aberdares Aroma Mist — Highland Jasmine & Green Tea",
        "brand_line": "Lisa Lux",
        "category_slug": "air-fresheners",
        "badge": "Long Lasting",
        "is_flagship": False,
        "rating": 4.93,
        "reviews_count": 114,
        "short_description": "Water-based botanical room perfume that eliminates odors and releases crisp, uplifting mountain floral notes.",
        "full_description": "Inspired by misty dawns over the Aberdare forest canopy. Our fine aerosol-free trigger mist neutralizes tobacco, cooking, and bathroom odors.",
        "base_price": 280,
        "default_size": "300ml Trigger Spray",
        "image": "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A+",
        "benefits": [
            "100% Gas-free trigger spray: Safe for indoor air and ozone layer",
            "Neutralizes odors with natural botanical odor-lock technology",
            "Fragrance lingers up to 8 hours"
        ],
        "ingredients": "Purified Highland Water, Jasmine Essential Oil, Green Tea Camellia Leaf Extract.",
        "sizes": [
            {"label": "300ml Trigger Spray", "price": 280, "segment": "Home / Car Mist"},
            {"label": "500ml Luxury Bottle", "price": 420, "segment": "Living Room & Bedroom"},
            {"label": "5 Litres", "price": 2200, "segment": "Hotel Housekeeping Refill"}
        ]
    },
    {
        "slug": "lisa-lux-pure-aloe-vera-gel",
        "name": "Lisa Lux 99% Pure Aberdare Aloe Vera Soothing Gel",
        "brand_line": "Lisa Lux",
        "category_slug": "skin-care",
        "badge": "100% Highland Grown",
        "is_flagship": True,
        "rating": 4.98,
        "reviews_count": 310,
        "short_description": "Multi-purpose soothing gel harvested from certified organic aloe fields along the Aberdare mountain slopes.",
        "full_description": "Cold-stabilized within 3 hours of hand harvesting in Ruiru and Kimbo farms. Instantly relieves sunburn, razor bumps, heat rash, dry scalp, and insect bites.",
        "base_price": 450,
        "default_size": "250ml",
        "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A++",
        "benefits": [
            "Instant cooling relief for sunburns, shaving irritation & burns",
            "Oil-free moisture perfect for oily & acne-prone African skin",
            "Pure organic raw gel with no added artificial fragrances"
        ],
        "ingredients": "Organic Aloe Barbadensis Leaf Juice (99%), Carbomer, Tocopheryl Acetate (Vitamin E), Ascorbic Acid.",
        "sizes": [
            {"label": "120ml", "price": 280, "segment": "Travel / Handbag Jar"},
            {"label": "250ml", "price": 450, "segment": "Everyday Skincare Tub"},
            {"label": "500ml", "price": 790, "segment": "Salon & Spa Pump Bottle"}
        ]
    },
    {
        "slug": "aberdare-hibiscus-strengthening-shampoo",
        "name": "Aberdares Botanicals Hibiscus & Rosemary Hair Growth Shampoo",
        "brand_line": "Lisa Lux",
        "category_slug": "hair-care",
        "badge": "Sulfate-Free Hair Care",
        "is_flagship": False,
        "rating": 4.89,
        "reviews_count": 94,
        "short_description": "Sulfate-free invigorating botanical shampoo for natural 4C, relaxed, braided, or chemically-treated hair.",
        "full_description": "Rich in amino acids and hibiscus mucilage, this revitalizing cleanser feeds hair follicles, eliminates dandruff, and stimulates healthy root growth.",
        "base_price": 480,
        "default_size": "400ml",
        "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80",
        "eco_score": "A+",
        "benefits": [
            "100% Sulfate-free formula won't strip natural curls or moisture",
            "Rosemary and hibiscus stimulate hair growth and combat edge thinning",
            "Safe for color-treated and dreadlocked hair"
        ],
        "ingredients": "Aqua, Cocamidopropyl Betaine, Decyl Glucoside, Hibiscus Sabdariffa Extract, Rosmarinus Officinalis Leaf Oil.",
        "sizes": [
            {"label": "400ml", "price": 480, "segment": "Pump Bottle"},
            {"label": "1 Litre", "price": 980, "segment": "Salon Economy Bottle"},
            {"label": "5 Litres", "price": 3400, "segment": "Hair Salon Bulk Jerrycan"}
        ]
    }
]

ARTICLES = [
    {
        "slug": "aloe-hibiscus-skincare-secret",
        "title": "Why Aberdare Highland Aloe & Hibiscus are Nature's Ultimate Skin Duo",
        "category": "Skincare Science",
        "read_time": "4 min read",
        "date_display": "September 2, 2026",
        "author": "Wanjiku Mwangi (Head Formulation Chemist)",
        "summary": "Discover why high-altitude aloe vera grown along the volcanic ridges of the Aberdare ranges produces 35% more active polysaccharides than coastal varieties.",
        "content": "The slopes of the Aberdare mountain range in Central Kenya boast mineral-rich volcanic soil, cool mountain nights, and abundant rainfall. These unique agro-climatic conditions stress the Aloe Barbadensis plant in a beneficial way, stimulating it to produce elevated concentrations of acemannan—the key polysaccharide responsible for skin healing and deep hydration.\n\nWhen paired with Hibiscus Sabdariffa (frequently referred to by dermatologists as 'nature's natural Botox'), the result is synergistic. Hibiscus is naturally packed with anthocyanocides and gentle alpha-hydroxy acids (AHAs) that accelerate cell turnover without causing skin peeling or photosensitivity.\n\nAt our Ruiru production facility, we cold-process fresh leaves delivered directly from farmer cooperatives within 4 hours of harvest, ensuring none of the botanical bio-actives are destroyed by excessive thermal processing.",
        "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
        "tags": ["Skincare", "Botanicals", "Aloe Vera", "Aberdares"]
    },
    {
        "slug": "eco-friendly-cleaning-kenya",
        "title": "Eco-Friendly Cleaning in Kenya: How to Clean Without Harming Your Garden or Greywater System",
        "category": "Eco Living",
        "read_time": "5 min read",
        "date_display": "August 24, 2026",
        "author": "David Kiprop (Environmental Safety Lead)",
        "summary": "Many Kenyan homes reuse washing water on bananas, sukuma wiki, and flowerbeds. Here is why conventional phosphates harm your soil and what eco-surfactants do instead.",
        "content": "Water scarcity and conservation are daily realities across Nairobi and Kiambu. Many environmentally conscious Kenyan households channel their laundry and rinse water (greywater) directly onto home gardens, avocado trees, or lawn grass.\n\nHowever, standard high-phosphate laundry powders accumulate sodium and phosphate salts in the soil over time. This alters the soil pH, impairs root respiration, and creates yellowing leaf chlorosis.\n\nAberdares Soaps formulates products like Batian Multipurpose Bar and Pure Clean Liquid Detergent using readily biodegradable plant-derived surfactants. These break down into harmless organic matter within 14 days of soil exposure, meaning your laundry water actually enriches soil microbes instead of poisoning them.",
        "image": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        "tags": ["Sustainability", "Greywater", "Eco Cleaning", "Garden Safe"]
    },
    {
        "slug": "biodigester-maintenance-guide",
        "title": "The Ultimate Kenyan Guide to Maintaining Bio-Digesters & Septic Tanks Without Costly Exhauster Calls",
        "category": "Sanitation & Hygiene",
        "read_time": "6 min read",
        "date_display": "August 10, 2026",
        "author": "Engineer Peter Karanja",
        "summary": "How modern enzyme and bacterial catalysts liquefy organic sludge, eliminate foul drain odors, and save homeowners thousands of shillings.",
        "content": "With the rapid expansion of modern estates in Ruiru, Juja, Kitengela, and Rongai, bio-digesters and biodisc septic systems have replaced traditional pit latrines and unlined soak pits.\n\nHowever, frequent flushing of harsh caustic sodas and excessive chlorinated bleaches destroys the resident anaerobic bacteria needed to digest human sludge. When these good bacteria die, grease solidifies, sludge accumulates, and unbearable sewer odors back up through floor drains.\n\nIntroducing Aberdares Eco-Flow Bio-Digester Bacterial Catalyst restores the active microbiome of your tank. Each dose contains billions of dormant Bacillus spores and lipase enzymes that immediately devour fats, oils, grease (FOG), and cellulose (toilet tissue), keeping soak-away trenches porous and flowing smoothly.",
        "image": "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=80",
        "tags": ["Bio-Digester", "Plumbing", "Home Care", "Ruiru"]
    },
    {
        "slug": "hotel-amenities-guest-experience",
        "title": "Upgrading Guest Delight: Why Kenya's Leading Boutique Safari Lodges & Airbnbs Choose Aberdares Soaps",
        "category": "Hospitality Insights",
        "read_time": "4 min read",
        "date_display": "July 28, 2026",
        "author": "Grace Muthoni (Hospitality Partnerships)",
        "summary": "Today's international and domestic travelers look for authentic, sustainable local stories in their hotel bathroom amenities.",
        "content": "When guests check into a boutique lodge in Naivasha, a tented camp in the Mara, or an executive Airbnb in Nairobi, the bathroom amenities represent one of their most intimate brand touchpoints.\n\nDiscerning travelers immediately notice when a facility supplies generic imported synthetic soaps wrapped in wasteful plastic. By contrast, offering Aberdares 15g and 25g Lisa Lux Botanical guest soaps wrapped in compostable kraft paper communicates an instant commitment to Kenyan heritage, local agriculture, and environmental stewardship.",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
        "tags": ["Hospitality", "Lodges", "Airbnbs", "Amenity Bars"]
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
    help = "Seeds demo catalog products matching React frontend mock data, demo admin user, articles, and promo codes."

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
            p_copy = dict(p_data)
            sizes = p_copy.pop("sizes")
            cat_slug = p_copy.pop("category_slug")
            p_copy["category"] = cat_map.get(cat_slug, cat_map["bar-soaps"])

            product, created = Product.objects.update_or_create(slug=p_copy["slug"], defaults=p_copy)
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

        # 5. Articles
        for a_data in ARTICLES:
            article, created = Article.objects.update_or_create(slug=a_data["slug"], defaults=a_data)
            action = "Created" if created else "Updated"
            self.stdout.write(f"{action} article: {article.title}")

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
