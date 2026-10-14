import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Check, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Leaf, 
  Award,
  Plus,
  Minus
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductDetailModal = () => {
  const { 
    isQuickViewOpen, 
    setIsQuickViewOpen, 
    quickViewProduct: product, 
    addToCart,
    toggleWishlist,
    isWishlisted
  } = useCart();

  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0]?.label || product.defaultSize || 'Standard');
      setQty(1);
    }
  }, [product]);

  if (!isQuickViewOpen || !product) return null;

  const currentSizeObj = product.sizes?.find(s => s.label === selectedSize) || {
    label: selectedSize,
    price: product.basePrice,
    segment: 'Standard pack'
  };

  const handleAdd = () => {
    addToCart(product, selectedSize, qty);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setIsQuickViewOpen(false); // Close product detail modal
    }, 400);
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-fadeIn my-6 relative">
        
        {/* Close button */}
        <button
          onClick={() => setIsQuickViewOpen(false)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-stone-100 text-stone-700 flex items-center justify-center shadow-md backdrop-blur-xs transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left: Product Image & Badges */}
          <div className="md:col-span-5 relative bg-stone-100 flex items-center justify-center min-h-[300px] md:min-h-full">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center max-h-[420px]"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.badge && (
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-aberdares-forest text-white shadow-md">
                  {product.badge}
                </span>
              )}
              {product.ecoScore && (
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Eco Score: {product.ecoScore}
                </span>
              )}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            
            <div>
              {/* Brand & Reviews */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                  {product.brandLine}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-stone-400 font-normal">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-aberdares-forest">
                  KSh {currentSizeObj.price.toLocaleString()}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  / {selectedSize}
                </span>
              </div>

              {/* Descriptions */}
              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                    <span>Available Package Sizes:</span>
                    {currentSizeObj.segment && (
                      <span className="text-emerald-700 font-medium text-[11px]">
                        Segment: {currentSizeObj.segment}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => setSelectedSize(s.label)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedSize === s.label
                            ? 'bg-aberdares-forest text-white shadow-sm ring-2 ring-emerald-600 ring-offset-1'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Benefits */}
              <div className="mt-4 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Key Benefits:
                </h4>
                {product.benefits?.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-stone-600">
                    <Check size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Ingredients */}
              {product.ingredients && (
                <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600">
                  <span className="font-bold text-slate-800 block mb-0.5">Ingredients / Formulation:</span>
                  <p className="leading-normal">{product.ingredients}</p>
                </div>
              )}
            </div>

            {/* Actions: Quantity & Add to Cart */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-3">
              
              {/* Qty */}
              <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 p-1">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-xs font-extrabold text-slate-900">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add button */}
              <button
                onClick={handleAdd}
                className={`flex-1 w-full py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                  addedAnimation
                    ? 'bg-emerald-700 text-white'
                    : 'bg-aberdares-forest hover:bg-aberdares-dark text-white active:scale-95'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check size={16} />
                    <span>Added to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Basket — KSh {(currentSizeObj.price * qty).toLocaleString()}</span>
                  </>
                )}
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  wishlisted 
                    ? 'bg-rose-50 border-rose-200 text-rose-500' 
                    : 'bg-white border-stone-300 text-stone-600 hover:text-rose-500'
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart size={18} className={wishlisted ? 'fill-rose-500' : ''} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
