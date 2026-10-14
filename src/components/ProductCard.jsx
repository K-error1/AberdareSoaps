import React, { useState } from 'react';
import { 
  Star, 
  Check, 
  ShoppingBag, 
  Eye, 
  Heart, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isWishlisted, 
    setQuickViewProduct, 
    setIsQuickViewOpen 
  } = useCart();

  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0]?.label || product.defaultSize || "Standard"
  );
  const [justAdded, setJustAdded] = useState(false);

  // Find the selected size price object
  const currentSizeObj = product.sizes?.find(s => s.label === selectedSize) || {
    label: selectedSize,
    price: product.basePrice
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Image Container with Badges */}
      <div 
        onClick={handleQuickView}
        className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-aberdares-forest text-white shadow-md">
              {product.badge}
            </span>
          )}
          {product.ecoScore && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
              Eco Grade: {product.ecoScore}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-xs transition-transform hover:scale-110 ${
            wishlisted 
              ? 'bg-rose-50 text-rose-500' 
              : 'bg-white/80 text-stone-600 hover:text-rose-500'
          }`}
          aria-label="Wishlist"
        >
          <Heart size={16} className={wishlisted ? 'fill-rose-500' : ''} />
        </button>

        {/* Quick View Hover Pill */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleQuickView}
            className="px-3.5 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5 hover:bg-white hover:text-emerald-800 transition-colors"
          >
            <Eye size={13} /> Quick Details
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        
        {/* Brand line & rating */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
            {product.brandLine}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-stone-400 font-normal">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={handleQuickView}
          className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-aberdares-forest cursor-pointer line-clamp-1 transition-colors"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed flex-1">
          {product.shortDescription}
        </p>

        {/* Botanical Highlights / Benefits */}
        <div className="my-3 py-2 border-t border-b border-stone-100 space-y-1">
          {product.benefits?.slice(0, 2).map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-600">
              <Check size={12} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Size Variant Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              <span>Select Size</span>
              {currentSizeObj.segment && (
                <span className="text-emerald-700 normal-case font-medium truncate max-w-[150px]">
                  {currentSizeObj.segment}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSelectedSize(s.label)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    selectedSize === s.label
                      ? 'bg-aberdares-forest text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pricing & Add to Cart */}
        <div className="pt-2 mt-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-stone-400 block font-medium">Price (KES)</span>
            <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              KSh {currentSizeObj.price.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              justAdded
                ? 'bg-emerald-700 text-white scale-95'
                : 'bg-stone-900 hover:bg-aberdares-forest text-white active:scale-95'
            }`}
            aria-label="Add to cart"
          >
            {justAdded ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
