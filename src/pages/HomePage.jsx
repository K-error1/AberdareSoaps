import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Leaf, 
  Award, 
  CheckCircle2, 
  Droplets, 
  Building2,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { products, flagshipLines } from '../data/products';
import { barSoapSizes } from '../data/barSoapSizes';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export const HomePage = ({ setActivePage, onCategorySelect }) => {
  const { setIsWholesaleModalOpen } = useCart();

  // Pick top flagship and bestsellers
  const featuredProducts = products.filter(p => p.isFlagship || p.rating >= 4.9).slice(0, 6);

  const handleShopClick = (catId = 'all') => {
    setActivePage('products');
    if (onCategorySelect) onCategorySelect(catId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-aberdares-dark to-stone-900 text-white pt-12 sm:pt-20 pb-20 sm:pb-32">
        {/* Background botanical accents */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 rounded-full bg-aberdares-forest/20 blur-3xl pointer-events-none" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#2e7d56_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles size={14} className="text-emerald-400" />
                <span>Authentically Kenyan • Ruiru, Kimbo</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Nature Meets <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                  Innovation
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Manufacturer of premium cleaning and personal-care products. We blend raw organic <strong>Aloe Vera</strong> and <strong>Hibiscus</strong> harvested along the Aberdare ranges with modern, eco-friendly precision manufacturing.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => handleShopClick('all')}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Shop Online Now</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => setIsWholesaleModalOpen(true)}
                  className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 backdrop-blur-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Building2 size={16} />
                  <span>Wholesale & Hotels</span>
                </button>
              </div>

              {/* Quick Trust Pillars */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-stone-800 text-left">
                <div className="space-y-0.5">
                  <span className="text-emerald-400 font-extrabold text-base sm:text-lg">100%</span>
                  <p className="text-[11px] text-stone-400">Highland Botanicals</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-emerald-400 font-extrabold text-base sm:text-lg">KEBS</span>
                  <p className="text-[11px] text-stone-400">Certified Standards</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-emerald-400 font-extrabold text-base sm:text-lg">15g – 1kg</span>
                  <p className="text-[11px] text-stone-400">Full Size Range</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-emerald-400 font-extrabold text-base sm:text-lg">M-Pesa</span>
                  <p className="text-[11px] text-stone-400">Instant STK Push</p>
                </div>
              </div>

            </div>

            {/* Hero Visual Card / Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Visual frame with soft border */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl shadow-emerald-950 bg-stone-900 aspect-4/5">
                  <img
                    src="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=1000&q=80"
                    alt="Aberdares Highland Soaps"
                    className="w-full h-full object-cover object-center transform scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                  
                  {/* Floating badge inside hero */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-xl border border-stone-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                        Featured Botanical Formula
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                        Ruiru Crafted
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      Lisa Lux™ Highland Aloe & Hibiscus
                    </h3>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      Cold-filtered aloe vera juice & wild mountain hibiscus for nourishing, gentle daily lather.
                    </p>
                  </div>
                </div>

                {/* Floating pill: Slogan */}
                <div className="absolute -top-4 -left-4 bg-amber-500 text-amber-950 px-4 py-2 rounded-2xl font-black text-xs shadow-xl hidden sm:flex items-center gap-1.5">
                  <Leaf size={14} />
                  <span>Nature Meets Innovation</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* THREE FLAGSHIP PRODUCT LINES (BATIAN, LISA LUX, ELSIE SUDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-aberdares-forest text-xs font-bold uppercase tracking-wider">
            <Award size={13} />
            <span>Our Flagship Formulations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Kenyan Homes & Businesses
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            From heavy-duty grease-cutting power to gentle dermatological bath bars, discover our three signature lines manufactured in Ruiru.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flagshipLines.map((line) => (
            <div 
              key={line.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-emerald-50 text-aberdares-forest flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                    {line.id === 'batian' && <ShieldCheck size={26} />}
                    {line.id === 'lisa-lux' && <Sparkles size={26} />}
                    {line.id === 'elsie-suds' && <Droplets size={26} />}
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest">
                    Signature
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900">
                  {line.name}
                </h3>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-0.5">
                  {line.tagline}
                </p>

                <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                  {line.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => handleShopClick('bar-soaps')}
                  className="text-xs font-bold text-aberdares-forest group-hover:text-emerald-600 flex items-center gap-1 transition-colors"
                >
                  <span>Explore Line</span>
                  <ChevronRight size={14} />
                </button>
                <span className="text-[10px] text-stone-400 font-semibold">100% Local Natural</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BAR SOAP SIZE SPECTRUM (15g to 1kg) */}
      <section className="bg-stone-100/80 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200/60 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Maximize2 size={13} />
                <span>Precision Sizes for Every Need</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Complete Bar Soap Size Spectrum (15g – 1kg)
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mt-1">
                From single-use luxury hotel guest bars to massive 1-Kilogram commercial laundry blocks, each size is tailored to its specific use case and market segment.
              </p>
            </div>
            <button
              onClick={() => handleShopClick('bar-soaps')}
              className="px-5 py-2.5 bg-aberdares-forest hover:bg-aberdares-dark text-white rounded-xl text-xs font-bold transition-colors self-start md:self-auto flex items-center gap-1.5 flex-shrink-0"
            >
              <span>View All Bar Soaps</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Size Scroll / Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {barSoapSizes.map((size) => (
              <div 
                key={size.weight}
                onClick={() => handleShopClick('bar-soaps')}
                className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-black text-aberdares-forest group-hover:scale-105 transition-transform">
                      {size.weight}
                    </span>
                    {size.popular && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                        Top Pick
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                    {size.category}
                  </h4>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 line-clamp-1">
                    {size.marketSegment}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-1.5 line-clamp-3 leading-relaxed">
                    {size.useCase}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-slate-900">
                    From KSh {size.retailPrice}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {size.cartonQty.split(' ')[0]} /ctn
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BESTSELLERS CAROUSEL / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
              Top Rated by Kenyan Households
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Featured Cleaners & Skincare
            </h2>
          </div>
          <button
            onClick={() => handleShopClick('all')}
            className="text-xs font-bold text-aberdares-forest hover:text-emerald-600 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Browse Full 9 Categories</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* NATURAL SOURCING & RUIRU HERITAGE STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 to-stone-900 rounded-3xl overflow-hidden shadow-2xl text-white border border-emerald-800/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wider uppercase">
                <Leaf size={14} />
                <span>Our Heritage & Origin</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                Rooted in the Rich Volcanic Ridges of the Aberdare Ranges
              </h2>

              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
                At Aberdares Soaps, we believe nature has already perfected the best ingredients for personal hygiene and cleaning. We partner with over 80 smallholder farmers across the Aberdares highlands who cultivate organic Aloe Barbadensis and mountain Hibiscus without synthetic pesticides.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-emerald-300 block">Ruiru Manufacturing Plant</span>
                  <p className="text-xs text-stone-300">
                    Kimbo – Matangi Road, equipped with precision saponification kettles, automated milling, and zero-effluent water treatment.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-amber-300 block">Community Fair-Trade</span>
                  <p className="text-xs text-stone-300">
                    Guaranteed purchase agreements provide predictable, empowering income to Kenyan youth and women farmers in Central Kenya.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-white text-stone-900 hover:bg-stone-100 rounded-xl text-xs font-extrabold transition-all shadow-md inline-flex items-center gap-2"
                >
                  <span>Read Our Full Story & Values</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 sm:h-96 lg:h-full relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80"
                alt="Aberdare Aloe Vera Harvesting"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent to-emerald-950/80" />
            </div>

          </div>
        </div>
      </section>


    </div>
  );
};
