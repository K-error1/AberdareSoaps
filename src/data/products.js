// Aberdares Soaps Complete Product Catalog
// All prices in Kenyan Shillings (KES / KSh)

export const categories = [
  { id: "all", name: "All Products" },
  { id: "bar-soaps", name: "Bar Soaps" },
  { id: "liquid-detergents", name: "Liquid Detergents" },
  { id: "hand-wash", name: "Hand Wash Liquid Soaps" },
  { id: "bleaching-agents", name: "Bleaching Agents" },
  { id: "bio-digester", name: "Bio-digester Chemicals" },
  { id: "powdered-detergents", name: "Powdered Detergents" },
  { id: "air-fresheners", name: "Air Fresheners" },
  { id: "skin-care", name: "Skin Care Products" },
  { id: "hair-care", name: "Shampoos & Conditioners" }
];

export const products = [
  // FLAGSHIP BAR SOAPS
  {
    id: "batian-multi-bar",
    name: "Batian Multipurpose Botanical Bar Soap",
    brandLine: "Batian",
    category: "bar-soaps",
    badge: "Flagship Bestseller",
    isFlagship: true,
    rating: 4.9,
    reviewsCount: 142,
    shortDescription: "Kenya's trusted high-foaming cleaning & laundry bar infused with Aberdare mountain pine and natural vegetable oils.",
    fullDescription: "Named after Mount Kenya's highest peak, Batian is engineered for Kenyan homes and commercial institutions. Its dense, triple-milled structure resists mushiness in soap trays and provides unmatched grease-cutting power in hard or borehole water.",
    basePrice: 180,
    defaultSize: "250g",
    sizes: [
      { label: "100g", price: 75, segment: "Daily Personal Bath" },
      { label: "150g", price: 105, segment: "Compact Family Size" },
      { label: "250g", price: 180, segment: "Everyday Multipurpose" },
      { label: "500g", price: 260, segment: "Heavy-Duty Laundry Block" },
      { label: "800g", price: 360, segment: "Long-Life Utility Bar" },
      { label: "1kg", price: 450, segment: "Industrial Master Block" }
    ],
    benefits: [
      "Rich dense lather even in cold & borehole water",
      "Gentle on hands, ruthless on fabric grease",
      "Triple-milled to outlast standard supermarket bars by 40%",
      "Biodegradable formulation safe for greywater garden use"
    ],
    ingredients: "Saponified African Palm Oil, Aberdare Mountain Pine Extract, Coconut Oil Fatty Acids, Glycerin, Sodium Silicate, Natural Chlorophyll.",
    image: "https://images.unsplash.com/photo-1607006311600-314b3b4d83ff?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A+"
  },
  {
    id: "lisa-lux-beauty-bar",
    name: "Lisa Lux Highland Aloe & Hibiscus Beauty Bar",
    brandLine: "Lisa Lux",
    category: "bar-soaps",
    badge: "Luxury Skincare",
    isFlagship: true,
    rating: 4.95,
    reviewsCount: 218,
    shortDescription: "Creamy cold-pressed luxury bathing bar combining freshly pressed Aberdare aloe vera gel and wild hibiscus flower extract.",
    fullDescription: "Lisa Lux is the epitome of our 'Nature Meets Innovation' philosophy. Sourced from high-altitude smallholder cooperatives on the slopes of the Aberdare mountain range, raw aloe vera soothes sensitive skin while hibiscus (nature's botox plant) provides gentle alpha-hydroxy rejuvenation.",
    basePrice: 160,
    defaultSize: "200g",
    sizes: [
      { label: "15g", price: 20, segment: "Luxury Hotel & Airbnb Amenity" },
      { label: "25g", price: 30, segment: "Travel & Gym Sachet" },
      { label: "50g", price: 45, segment: "Children & Sensitive Facial" },
      { label: "100g", price: 95, segment: "Daily Radiance Bath Bar" },
      { label: "200g", price: 160, segment: "Triple-Milled Luxury Bar" }
    ],
    benefits: [
      "Pure Aberdare Highland Aloe Vera hydrates dry skin",
      "Natural Hibiscus flower antioxidants enhance skin elasticity",
      "Free of harsh parabens, phthalates, and synthetic sulfates",
      "Suitable for all skin types, eczema-prone skin, and children"
    ],
    ingredients: "Cold-Pressed Olive & Coconut Oil, Cold-Filtered Aloe Barbadensis Leaf Juice, Hibiscus Sabdariffa Extract, Shea Butter, Vitamin E, Essential Jasmine Oil.",
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A+"
  },
  {
    id: "elsie-suds-laundry-bar",
    name: "Elsie Suds Ultra-Foam Laundry & Dishwashing Bar",
    brandLine: "Elsie Suds",
    category: "bar-soaps",
    badge: "Super Whitener",
    isFlagship: true,
    rating: 4.85,
    reviewsCount: 96,
    shortDescription: "High-suds oxygenated washing bar formulated for stubborn Kenyan red soil stains, grease, and cookware shine.",
    fullDescription: "Elsie Suds delivers effortless stain lifting without burning or drying your skin. Perfect for soaking school uniforms, kitchen cloths, and delicate hand-wash fabrics, it leaves clothes smelling alpine-fresh and naturally bright.",
    basePrice: 260,
    defaultSize: "500g",
    sizes: [
      { label: "150g", price: 105, segment: "Handy Kitchen Sink Bar" },
      { label: "250g", price: 170, segment: "Household Daily Laundry" },
      { label: "500g", price: 260, segment: "Heavy-Duty Stain Eraser Block" },
      { label: "1kg", price: 440, segment: "Institutional Wash Block" }
    ],
    benefits: [
      "Active oxygen brighteners remove tough red clay & oil stains",
      "Sparkling finish on aluminum and stainless cookware",
      "Skin-comforting coconut glycerin prevents finger irritation",
      "Ultra-compact formulation resists dissolving in water bowls"
    ],
    ingredients: "Plant-derived Surfactants, Sodium Carbonate, Coconut Fatty Acid Extract, Optical Brightening Minerals, Mountain Lemon Essence.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A"
  },

  // LIQUID DETERGENTS
  {
    id: "aberdare-ultra-liquid-detergent",
    name: "Aberdares Pure Clean Multi-Action Liquid Detergent",
    brandLine: "Aberdares Pure",
    category: "liquid-detergents",
    badge: "High Efficiency",
    isFlagship: false,
    rating: 4.88,
    reviewsCount: 84,
    shortDescription: "Concentrated enzyme-powered liquid detergent for machine & hand wash. Tough on collar dirt, soft on fabrics.",
    fullDescription: "Formulated in our Ruiru laboratories, this phosphate-free formula dissolves instantly in cold water. Contains bio-enzymes that break down proteins, grease, and soil without weakening cotton fibres or fading African wax prints (Kitenge).",
    basePrice: 380,
    defaultSize: "1 Litre",
    sizes: [
      { label: "1 Litre", price: 380, segment: "Standard Bottle" },
      { label: "2 Litres", price: 690, segment: "Family Value Bottle" },
      { label: "5 Litres", price: 1450, segment: "Economy Jerrycan" },
      { label: "20 Litres", price: 4800, segment: "Commercial / Laundromat Drum" }
    ],
    benefits: [
      "High Efficiency (HE) — compatible with top & front load washers",
      "Zero residue on dark clothes and vibrant Kitenge fabrics",
      "Low foam formula saves water during rinse cycles",
      "Highland Lavender & Pine lasting fragrance"
    ],
    ingredients: "Biodegradable Anionic & Non-ionic Surfactants, Natural Protease & Amylase Enzymes, Softening Conditioners, Mountain Lavender Oil.",
    image: "https://images.unsplash.com/photo-1585837575652-267c041d77d4?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A+"
  },
  {
    id: "aberdare-dishwash-liquid",
    name: "Aberdares Sparkle Citrus Dishwashing Liquid",
    brandLine: "Aberdares Pure",
    category: "liquid-detergents",
    badge: "Grease Stripper",
    isFlagship: false,
    rating: 4.9,
    reviewsCount: 110,
    shortDescription: "Thick, grease-dissolving dish liquid with real lemon peel extract and skin-conditioning aloe.",
    fullDescription: "A few concentrated drops slice straight through cooking oil, beef stew residue, and ugali starch on pots and cutlery. Leaves glassware streak-free with no chemical smell.",
    basePrice: 220,
    defaultSize: "750ml",
    sizes: [
      { label: "500ml", price: 160, segment: "Flip-top Dispenser" },
      { label: "750ml", price: 220, segment: "Pump Bottle" },
      { label: "5 Litres", price: 1150, segment: "Restaurant & Catering Jerrycan" },
      { label: "20 Litres", price: 3900, segment: "Hospitality Bulk Drum" }
    ],
    benefits: [
      "1 drop cleans up to 5 plates with instant degreasing",
      "Infused with Aberdare aloe vera to keep hands soft",
      "Neutral pH formula doesn't etch glassware or porcelain",
      "Anti-bacterial food-safe sanitizing agents"
    ],
    ingredients: "Sodium Laureth Sulfate (Plant-derived), Cocamidopropyl Betaine, Citrus Limon Extract, Aberdare Aloe Vera Gel, Food-grade Colorant.",
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A"
  },

  // HAND WASH LIQUID SOAPS (ALOE VERA ENRICHED)
  {
    id: "aloe-hibiscus-handwash",
    name: "Aberdares Botanicals Aloe Vera & Hibiscus Hand Wash",
    brandLine: "Lisa Lux",
    category: "hand-wash",
    badge: "Aloe Vera Enriched",
    isFlagship: false,
    rating: 4.96,
    reviewsCount: 164,
    shortDescription: "Ultra-moisturizing antibacterial hand wash infused with 100% pure organic Aberdare Aloe Vera and floral hibiscus.",
    fullDescription: "Repeated hand washing shouldn't strip your skin's moisture barrier. Our soothing formula blends natural antibacterial botanical extracts with organic aloe vera juice from our highland grower partners in Nyeri and Kiambu.",
    basePrice: 290,
    defaultSize: "500ml",
    sizes: [
      { label: "300ml", price: 210, segment: "Designer Countertop Pump" },
      { label: "500ml", price: 290, segment: "Family Pump Bottle" },
      { label: "5 Litres", price: 1350, segment: "Refill Jerrycan for Offices & Schools" },
      { label: "20 Litres", price: 4400, segment: "Corporate & Hotel Refill Drum" }
    ],
    benefits: [
      "Kills 99.9% of bacteria and germs naturally",
      "Enriched with 30% organic cold-filtered Aloe Vera gel",
      "Silky velvet lather with refreshing botanical fragrance",
      "Dermatologically tested and hypoallergenic"
    ],
    ingredients: "Aqua, Aberdare Aloe Barbadensis Juice, Hibiscus Sabdariffa Extract, Glycerin, Coco-Glucoside, Chlorhexidine Gluconate (mild), Rose Floral Hydrosol.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A+"
  },
  {
    id: "tea-tree-eucalyptus-handwash",
    name: "Aberdares Defense Tea Tree & Eucalyptus Antibacterial Hand Wash",
    brandLine: "Aberdares Pure",
    category: "hand-wash",
    badge: "Hospital Grade",
    isFlagship: false,
    rating: 4.82,
    reviewsCount: 76,
    shortDescription: "Clinical-grade hygiene hand wash with antiseptic tea tree oil, cooling eucalyptus, and hydrating glycerin.",
    fullDescription: "Developed for medical clinics, commercial kitchens, food processing plants, and high-traffic washrooms where hygiene cannot be compromised.",
    basePrice: 320,
    defaultSize: "500ml",
    sizes: [
      { label: "500ml", price: 320, segment: "Clinic / Kitchen Pump" },
      { label: "5 Litres", price: 1550, segment: "Commercial Dispenser Refill" },
      { label: "20 Litres", price: 4950, segment: "Bulk Facility Jerrycan" }
    ],
    benefits: [
      "Maximum germicidal efficacy without drying skin",
      "Crisp eucalyptus odor neutralizer",
      "Ideal for restaurants, schools, dental surgeries, and food packers",
      "Certified KEBS standard compliance"
    ],
    ingredients: "Aqua, Melaleuca Alternifolia (Tea Tree) Oil, Eucalyptus Globulus Leaf Oil, Glycerin, Sodium Coco-Sulfate, Mild Biocides.",
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A"
  },

  // BLEACHING AGENTS
  {
    id: "aberdare-power-bleach-regular",
    name: "Aberdares Max-Guard Sodium Hypochlorite Disinfectant Bleach",
    brandLine: "Aberdares Pure",
    category: "bleaching-agents",
    badge: "Disinfectant & Whitener",
    isFlagship: false,
    rating: 4.87,
    reviewsCount: 52,
    shortDescription: "Heavy-duty commercial sanitizing bleach for hospital-level surface disinfection, white linens, and sanitation.",
    fullDescription: "Stable 5.25% sodium hypochlorite formulation for killing pathogens, mildew, mold, and neutralizing bad drainage odors. Essential for slaughterhouses, poultry facilities, health centres, and domestic deep cleaning.",
    basePrice: 150,
    defaultSize: "750ml",
    sizes: [
      { label: "750ml", price: 150, segment: "Child-Lock Safety Bottle" },
      { label: "2 Litres", price: 340, segment: "Domestic Value Bottle" },
      { label: "5 Litres", price: 680, segment: "Institutional Jerrycan" },
      { label: "20 Litres", price: 2300, segment: "Commercial Sanitation Drum" }
    ],
    benefits: [
      "Kills 99.99% of bacteria, viruses, fungi, and spores",
      "Restores brilliant whites to hospital bedding, lab coats & towels",
      "Stabilized formula maintains strength 2x longer on shelf",
      "Safety vented cap on bulk containers"
    ],
    ingredients: "Active Sodium Hypochlorite (5.25%), Sodium Hydroxide stabilizer, Deionized Water, Corrosion Inhibitor.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "B+"
  },
  {
    id: "aberdare-colorsafe-oxygen-bleach",
    name: "Aberdares ColorSafe Oxygen Bleach & Stain Booster",
    brandLine: "Elsie Suds",
    category: "bleaching-agents",
    badge: "Fabric Safe",
    isFlagship: false,
    rating: 4.91,
    reviewsCount: 68,
    shortDescription: "Chlorine-free active oxygen bleaching liquid safe for all colored fabrics, baby clothes, and delicate curtains.",
    fullDescription: "Harnesses hydrogen peroxide micro-bubbles to lift wine, coffee, mud, and collar perspiration without weakening fibers or stripping bright fabric dyes.",
    basePrice: 280,
    defaultSize: "1 Litre",
    sizes: [
      { label: "1 Litre", price: 280, segment: "Laundry Booster" },
      { label: "5 Litres", price: 1200, segment: "Hotel Laundry Refill" }
    ],
    benefits: [
      "100% Chlorine-free: Will not bleach out bright colors",
      "Safe on school blazers, bed covers, and sport jerseys",
      "Neutralizes pet and sweat odors naturally",
      "Breaks down into pure water and oxygen"
    ],
    ingredients: "Hydrogen Peroxide stabilized complex, Non-ionic Surfactant, Fragrance Stabilizer.",
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A+"
  },

  // BIO-DIGESTER CHEMICALS
  {
    id: "aberdare-biodigester-activator",
    name: "Aberdares Eco-Flow Bio-Digester Bacterial Catalyst",
    brandLine: "Aberdares Pure",
    category: "bio-digester",
    badge: "Eco-Active Bio Enzyme",
    isFlagship: false,
    rating: 4.97,
    reviewsCount: 189,
    shortDescription: "Concentrated anaerobic and aerobic microbial inoculant for septic tanks, pit latrines, bio-digesters, and soak pits.",
    fullDescription: "Engineered specifically for Kenyan residential and institutional waste systems. Liquefies solid waste, degrades fat, oil & grease (FOG), eliminates foul odors within 24 hours, and prevents expensive exhaustor/honey sucker tanker emptying.",
    basePrice: 950,
    defaultSize: "1kg Powder / 1L Liquid",
    sizes: [
      { label: "1kg Powder", price: 950, segment: "Quarterly Household Dose" },
      { label: "2 Litres Liquid", price: 1750, segment: "Semi-Annual Tank Shock Treatment" },
      { label: "5kg Bucket", price: 3900, segment: "Schools, Apartments & Estates" },
      { label: "20kg Institutional Drum", price: 13500, segment: "Hotel Resorts, Campgrounds & Hospitals" }
    ],
    benefits: [
      "Rapidly breaks down human sludge, toilet paper, and fats",
      "Permanently clears offensive sewage and drain odors",
      "Saves up to KSh 30,000 annually in exhauster pumping fees",
      "100% organic, non-pathogenic microbes safe for ground water"
    ],
    ingredients: "Multi-strain Bacillus dormant spore consortium, Lipase, Cellulase, Protease enzymes, Cereal carrier substrate.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A++"
  },
  {
    id: "aberdare-drain-unblocker-enzyme",
    name: "Aberdares Bio-Clog Enzyme Drain & Grease-Trap Digester",
    brandLine: "Aberdares Pure",
    category: "bio-digester",
    badge: "Pipe Safe",
    isFlagship: false,
    rating: 4.86,
    reviewsCount: 63,
    shortDescription: "Non-corrosive natural bacterial degreaser for hotel grease traps, kitchen sinks, and hotel restaurant drains.",
    fullDescription: "Unlike dangerous caustic soda that hardens grease into concrete-like fatbergs and corrodes PVC pipes, Bio-Clog feeds directly on grease and soap scum, converting it into harmless carbon dioxide and water.",
    basePrice: 650,
    defaultSize: "1 Litre",
    sizes: [
      { label: "1 Litre", price: 650, segment: "Kitchen Drain Bottle" },
      { label: "5 Litres", price: 2600, segment: "Hotel Grease Trap Treatment" }
    ],
    benefits: [
      "Will not heat, crack, or damage PVC or metal drainage pipes",
      "Restores full drain flow speed in commercial kitchens",
      "Zero toxic fumes — completely safe around food prep areas",
      "Continuous preventative protection with monthly maintenance"
    ],
    ingredients: "Active Bacterial Cultures, Lipolytic Enzymes, Natural Bio-Surfactants, Peppermint Extract.",
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A+"
  },

  // POWDERED DETERGENTS
  {
    id: "batian-power-washing-powder",
    name: "Batian Active-Enzyme High Foam Washing Powder",
    brandLine: "Batian",
    category: "powdered-detergents",
    badge: "Deep Clean",
    isFlagship: true,
    rating: 4.88,
    reviewsCount: 135,
    shortDescription: "Concentrated washing powder with stain-lifting oxygen pearls and long-lasting mountain flower freshness.",
    fullDescription: "Specially formulated for Kenyan hand washing and twin-tub washing machines. The dense, fragrant foam lifts deep grime from school white socks, rugby jerseys, and household linens without harsh abrasives.",
    basePrice: 240,
    defaultSize: "1kg",
    sizes: [
      { label: "500g", price: 130, segment: "Compact Pack" },
      { label: "1kg", price: 240, segment: "Family Size" },
      { label: "3.5kg", price: 780, segment: "Value Bucket with Scoop" },
      { label: "10kg", price: 2100, segment: "Institutional Sack" },
      { label: "25kg", price: 4800, segment: "Commercial Laundry Bulk Sack" }
    ],
    benefits: [
      "Instant mountain flower scent that lasts on clothes for 7+ days",
      "Micro-granules dissolve immediately without leaving white chalk streaks",
      "Gentle softening agents protect fabric elasticity and softness",
      "Enhanced foaming action optimized for borehole & tap water"
    ],
    ingredients: "Sodium Alkylbenzene Sulfonate, Sodium Carbonate, Sodium Sulfate, Stain-Releasing Enzymes, Fabric Whitening Pigments, Mountain Bloom Perfume.",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A"
  },

  // AIR FRESHENERS
  {
    id: "aberdare-highland-jasmine-spray",
    name: "Aberdares Aroma Mist — Highland Jasmine & Green Tea",
    brandLine: "Lisa Lux",
    category: "air-fresheners",
    badge: "Long Lasting",
    isFlagship: false,
    rating: 4.93,
    reviewsCount: 114,
    shortDescription: "Water-based botanical room perfume that eliminates odors and releases crisp, uplifting mountain floral notes.",
    fullDescription: "Inspired by misty dawns over the Aberdare forest canopy. Our fine aerosol-free trigger mist neutralizes tobacco, cooking, and bathroom odors rather than merely masking them with heavy chemicals.",
    basePrice: 280,
    defaultSize: "300ml Trigger Spray",
    sizes: [
      { label: "300ml Trigger Spray", price: 280, segment: "Home / Car Mist" },
      { label: "500ml Luxury Bottle", price: 420, segment: "Living Room & Bedroom" },
      { label: "5 Litres", price: 2200, segment: "Hotel Housekeeping Refill" }
    ],
    benefits: [
      "100% Gas-free trigger spray: Safe for indoor air and ozone layer",
      "Neutralizes odors with natural botanical odor-lock technology",
      "Non-staining formula safe for bedsheets, sofas, and curtains",
      "Fragrance lingers up to 8 hours"
    ],
    ingredients: "Purified Highland Water, Jasmine Essential Oil, Green Tea Camellia Leaf Extract, Botanical Odor Neutralizer, Cosmetic Solvent.",
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A+"
  },
  {
    id: "aberdare-mountain-breeze-spray",
    name: "Aberdares Aroma Mist — Aberdare Pine & Crisp Eucalyptus",
    brandLine: "Aberdares Pure",
    category: "air-fresheners",
    badge: "Odor Neutralizer",
    isFlagship: false,
    rating: 4.89,
    reviewsCount: 88,
    shortDescription: "Invigorating forest blend of pine needles, crisp eucalyptus, and wild cedar for executive offices and vehicles.",
    fullDescription: "Brings the therapeutic crispness of high mountain air right into your car, boardroom, or master bedroom. Highly effective in washrooms and smoking lounges.",
    basePrice: 280,
    defaultSize: "300ml Trigger Spray",
    sizes: [
      { label: "300ml Trigger Spray", price: 280, segment: "Office & Vehicle" },
      { label: "5 Litres", price: 2200, segment: "Commercial Washroom Refill" }
    ],
    benefits: [
      "Instant deodorizing power against dampness and mildew",
      "Aromatherapeutic clarity for focused work environments",
      "Aerosol-free eco spray"
    ],
    ingredients: "Deionized Water, Pinus Sylvestris Needle Oil, Eucalyptus Leaf Extract, Cedarwood Extract, Alcohol Denat.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A+"
  },

  // SKIN CARE PRODUCTS
  {
    id: "lisa-lux-pure-aloe-vera-gel",
    name: "Lisa Lux 99% Pure Aberdare Aloe Vera Soothing Gel",
    brandLine: "Lisa Lux",
    category: "skin-care",
    badge: "100% Highland Grown",
    isFlagship: true,
    rating: 4.98,
    reviewsCount: 310,
    shortDescription: "Multi-purpose soothing gel harvested from certified organic aloe fields along the Aberdare mountain slopes.",
    fullDescription: "Cold-stabilized within 3 hours of hand harvesting in Ruiru and Kimbo farms. Instantly relieves sunburn, razor bumps, heat rash, dry scalp, and insect bites. Lightweight, completely non-sticky, and fast absorbing.",
    basePrice: 450,
    defaultSize: "250ml",
    sizes: [
      { label: "120ml", price: 280, segment: "Travel / Handbag Jar" },
      { label: "250ml", price: 450, segment: "Everyday Skincare Tub" },
      { label: "500ml", price: 790, segment: "Salon & Spa Pump Bottle" }
    ],
    benefits: [
      "Instant cooling relief for sunburns, shaving irritation & burns",
      "Oil-free moisture perfect for oily & acne-prone African skin",
      "Can be used as a leave-in hair conditioner and curl definer",
      "Pure organic raw gel with no added artificial fragrances"
    ],
    ingredients: "Organic Aloe Barbadensis Leaf Juice (99%), Carbomer, Tocopheryl Acetate (Vitamin E), Ascorbic Acid (Vitamin C), Potassium Sorbate.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A++"
  },
  {
    id: "lisa-lux-hibiscus-shea-body-lotion",
    name: "Lisa Lux Highland Hibiscus & Raw Shea Butter Body Lotion",
    brandLine: "Lisa Lux",
    category: "skin-care",
    badge: "Deep Hydration",
    isFlagship: false,
    rating: 4.92,
    reviewsCount: 145,
    shortDescription: "Velvety 48-hour moisture body lotion enriched with Aberdare mountain honey, hibiscus nectar, and cold-pressed shea.",
    fullDescription: "Leaves your skin deeply nourished, firm, and glowing with a soft natural sheen. Absorbs instantly into skin without greasy residue, keeping your skin radiant throughout the dusty dry Kenyan seasons.",
    basePrice: 550,
    defaultSize: "400ml",
    sizes: [
      { label: "200ml", price: 340, segment: "Hand Cream Tube" },
      { label: "400ml", price: 550, segment: "Daily Body Pump Bottle" },
      { label: "1 Litre", price: 1100, segment: "Family Luxury Dispenser" }
    ],
    benefits: [
      "Locks in hydration for 48 hours in arid Kenyan weather",
      "Natural hibiscus AHA tightens and evens skin tone",
      "Non-comedogenic, non-greasy fast absorption",
      "Leaves skin delicate with mountain wildflower aroma"
    ],
    ingredients: "Aqua, Butyrospermum Parkii (Shea Butter), Hibiscus Sabdariffa Flower Extract, Aberdare Wild Honey, Sweet Almond Oil, Vegetable Glycerin, Niacinamide.",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A+"
  },

  // SHAMPOOS & CONDITIONERS
  {
    id: "aberdare-hibiscus-strengthening-shampoo",
    name: "Aberdares Botanicals Hibiscus & Rosemary Hair Growth Shampoo",
    brandLine: "Lisa Lux",
    category: "hair-care",
    badge: "Sulfate-Free Hair Care",
    isFlagship: false,
    rating: 4.89,
    reviewsCount: 94,
    shortDescription: "Sulfate-free invigorating botanical shampoo for natural 4C, relaxed, braided, or chemically-treated hair.",
    fullDescription: "Rich in amino acids and hibiscus mucilage, this revitalizing cleanser feeds hair follicles, eliminates dandruff, and stimulates healthy root growth while preserving the scalp's natural sebum oils.",
    basePrice: 480,
    defaultSize: "400ml",
    sizes: [
      { label: "400ml", price: 480, segment: "Pump Bottle" },
      { label: "1 Litre", price: 980, segment: "Salon Economy Bottle" },
      { label: "5 Litres", price: 3400, segment: "Hair Salon Bulk Jerrycan" }
    ],
    benefits: [
      "100% Sulfate-free formula won't strip natural curls or moisture",
      "Rosemary and hibiscus stimulate hair growth and combat edge thinning",
      "Gentle apple-cider vinegar balance clarifies product buildup",
      "Safe for color-treated and dreadlocked hair"
    ],
    ingredients: "Aqua, Cocamidopropyl Betaine, Decyl Glucoside, Hibiscus Sabdariffa Extract, Rosmarinus Officinalis (Rosemary) Leaf Oil, Aloe Vera, Panthenol (Pro-Vitamin B5).",
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A+"
  },
  {
    id: "aberdare-aloe-deep-moisture-conditioner",
    name: "Aberdares Botanicals Aloe & Avocado Deep Moisture Conditioner",
    brandLine: "Lisa Lux",
    category: "hair-care",
    badge: "Detangling Wonder",
    isFlagship: false,
    rating: 4.94,
    reviewsCount: 112,
    shortDescription: "Creamy slip conditioner with raw Aberdare aloe vera juice and cold-pressed avocado oil for easy comb-out.",
    fullDescription: "Tangles melt away in seconds under this rich, creamy slip formula. Restores moisture to dry, brittle hair strands and leaves locks feather-soft with natural bounce and shine.",
    basePrice: 520,
    defaultSize: "400ml",
    sizes: [
      { label: "400ml", price: 520, segment: "Pump Bottle" },
      { label: "1 Litre", price: 1050, segment: "Salon Size" },
      { label: "5 Litres", price: 3600, segment: "Bulk Salon Jerrycan" }
    ],
    benefits: [
      "High slip instantly untangles stubborn knots and tight curls",
      "Deep moisture infusion seals split ends and prevents hair breakage",
      "Can be used as a wash-out conditioner or leave-in treatment",
      "Natural shine enhancer without heavy silicones"
    ],
    ingredients: "Aqua, Aloe Barbadensis Leaf Juice, Persea Gratissima (Avocado) Oil, Cetearyl Alcohol, Behentrimonium Methosulfate, Shea Butter, Hydrolyzed Wheat Protein.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    ecoScore: "A+"
  }
];

export const flagshipLines = [
  {
    id: "batian",
    name: "Batian™ Series",
    tagline: "Uncompromising Mountain Strength",
    description: "Built for resilience. Tough on grease, stains, and dirt while staying dense and long-lasting in every Kenyan household.",
    highlightProducts: ["batian-multi-bar", "batian-power-washing-powder"],
    accentColor: "from-emerald-800 to-teal-900",
    icon: "ShieldCheck"
  },
  {
    id: "lisa-lux",
    name: "Lisa Lux™ Skincare",
    tagline: "Highland Botanical Radiance",
    description: "Crafted with pure organic Aloe Vera & wild Hibiscus from the Aberdare highlands. Gentle luxury for delicate skin.",
    highlightProducts: ["lisa-lux-beauty-bar", "lisa-lux-pure-aloe-vera-gel", "aloe-hibiscus-handwash"],
    accentColor: "from-rose-900 to-amber-900",
    icon: "Sparkles"
  },
  {
    id: "elsie-suds",
    name: "Elsie Suds™ Clean",
    tagline: "Effortless Foaming Purity",
    description: "High-density oxygenated laundry bars, dish cleaners, and fabric brighteners engineered to defeat tough red soil.",
    highlightProducts: ["elsie-suds-laundry-bar", "aberdare-colorsafe-oxygen-bleach"],
    accentColor: "from-sky-800 to-indigo-900",
    icon: "Droplets"
  }
];
