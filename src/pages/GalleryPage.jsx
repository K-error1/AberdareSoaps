import React, { useState } from 'react';
import { Camera, Sparkles, Filter, MapPin, ZoomIn } from 'lucide-react';

export const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxImg, setLightboxImg] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: "Lisa Lux Highland Aloe & Hibiscus Cold Pressing",
      category: "production",
      categoryLabel: "Ruiru Production",
      image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=900&q=80",
      caption: "Hand-milling herbal soap bars with fresh Aberdare botanical purees in Kimbo facility."
    },
    {
      id: 2,
      title: "Smallholder Aloe Vera Harvest in Central Kenya",
      category: "sourcing",
      categoryLabel: "Ingredient Sourcing",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
      caption: "Organically grown Aloe Barbadensis harvested in morning mist along Aberdare foothills."
    },
    {
      id: 3,
      title: "Batian Multipurpose Triple-Milled Bars Curing",
      category: "products",
      categoryLabel: "Finished Products",
      image: "https://images.unsplash.com/photo-1607006311600-314b3b4d83ff?auto=format&fit=crop&w=900&q=80",
      caption: "Dense, long-lasting bar soap batches cooling in our solar-assisted curing chambers."
    },
    {
      id: 4,
      title: "Safari Lodge Hotel Amenity Packaging (25g)",
      category: "products",
      categoryLabel: "Finished Products",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
      caption: "Eco-friendly pleat-wrapped guest soap bars customized for leading Kenyan eco-lodges."
    },
    {
      id: 5,
      title: "Community Tree Planting & Water Conservation in Kiambu",
      category: "community",
      categoryLabel: "Community & CSR",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
      caption: "Aberdares Soaps staff and youth planting indigenous cedar and bamboo along riparian reserves."
    },
    {
      id: 6,
      title: "Liquid Compounding & Quality Control Lab in Ruiru",
      category: "production",
      categoryLabel: "Ruiru Production",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80",
      caption: "Testing pH balance and active enzyme stability before bottling into recyclable containers."
    },
    {
      id: 7,
      title: "Organic Red Hibiscus Calyces Sun-Drying",
      category: "sourcing",
      categoryLabel: "Ingredient Sourcing",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
      caption: "Hibiscus Sabdariffa flowers rich in natural AHAs and anthocyanocides prepared for extraction."
    },
    {
      id: 8,
      title: "Local Women Cooperative Training on Regenerative Farming",
      category: "community",
      categoryLabel: "Community & CSR",
      image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=900&q=80",
      caption: "Workshops empowering smallholder growers with organic soil regeneration techniques."
    },
    {
      id: 9,
      title: "Botanical Aromatherapy Mists (Highland Jasmine)",
      category: "products",
      categoryLabel: "Finished Products",
      image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=80",
      caption: "Aerosol-free water-based room perfumes infused with mountain jasmine and tea tree."
    }
  ];

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <Camera size={13} />
          <span>Visual Journey</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Aberdares Visual Gallery
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          From mountain aloe fields to our Ruiru factory floor, see how our "Nature Meets Innovation" philosophy comes to life.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {[
          { id: 'all', label: 'All Photos' },
          { id: 'products', label: 'Pure Product Showcase' },
          { id: 'production', label: 'Ruiru Production Plant' },
          { id: 'sourcing', label: 'Aberdare Highland Sourcing' },
          { id: 'community', label: 'Community & Trees' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeFilter === f.id
                ? 'bg-aberdares-forest text-white shadow-md'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Gallery Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxImg(item)}
            className="group relative rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm hover:shadow-xl transition-all cursor-pointer aspect-4/3 flex flex-col justify-end"
          >
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            <div className="relative p-5 text-white z-10 space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/80 text-[10px] font-extrabold uppercase tracking-wider">
                {item.categoryLabel}
              </span>
              <h3 className="font-extrabold text-sm sm:text-base leading-snug">
                {item.title}
              </h3>
              <p className="text-[11px] text-stone-300 line-clamp-2">
                {item.caption}
              </p>
            </div>

            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full bg-stone-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-stone-700"
          >
            <div className="relative aspect-16/10 max-h-[60vh] bg-stone-950">
              <img
                src={lightboxImg.image}
                alt={lightboxImg.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-[10px] font-extrabold uppercase">
                {lightboxImg.categoryLabel}
              </span>
              <h3 className="text-xl font-bold text-white">{lightboxImg.title}</h3>
              <p className="text-xs text-stone-300 leading-relaxed">{lightboxImg.caption}</p>
              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setLightboxImg(null)}
                  className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200"
                >
                  Close Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
