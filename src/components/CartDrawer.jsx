import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  Check,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartDrawer = ({ setActivePage }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    discountAmount,
    actualDeliveryFee,
    cartTotal,
    appliedPromo,
    promoCodeInput,
    setPromoCodeInput,
    applyPromoCode,
    removePromoCode,
    promoError,
    deliveryOption,
    setDeliveryOption,
    setIsCheckoutOpen,
    isFreeDeliveryEligible
  } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isCartOpen) return null;

  const freeDeliveryGap = Math.max(0, 3000 - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / 3000) * 100));

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      if (setActivePage) {
        setActivePage('account');
      }
      return;
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slideLeft">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-aberdares-forest" size={20} />
              <h2 className="text-lg font-bold text-slate-800">Your Basket</h2>
              <span className="bg-emerald-100 text-aberdares-forest font-semibold text-xs px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-emerald-50/70 px-4 py-2.5 border-b border-emerald-100 text-xs text-emerald-900">
            {isFreeDeliveryEligible ? (
              <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                <Check size={16} className="text-emerald-600 flex-shrink-0" />
                <span>You qualify for <strong>FREE Delivery</strong> in Nairobi & Kiambu!</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1 text-emerald-800">
                  <span className="flex items-center gap-1">
                    <Truck size={13} />
                    <span>Add <strong>KSh {freeDeliveryGap.toLocaleString()}</strong> more for Free Delivery</span>
                  </span>
                  <span className="font-bold">{freeDeliveryProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-emerald-200/70 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-700 text-base">Your basket is empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Discover our authentic Kenyan botanical bar soaps, detergents, and skincare handcrafted in Ruiru.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    if (setActivePage) {
                      setActivePage('products');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="px-5 py-2.5 bg-aberdares-forest text-white rounded-xl text-xs font-bold shadow-md hover:bg-aberdares-deep transition-all"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="py-3.5 flex gap-3.5 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-stone-200 flex-shrink-0 bg-stone-50"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {item.brandLine}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-semibold">
                        Size: {item.size}
                      </span>
                      <span className="text-xs font-extrabold text-aberdares-dark">
                        KSh {item.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-800">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Panel */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/90 space-y-3">
              
              {/* Promo Code Input */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-900">
                      <Tag size={13} className="text-emerald-700" />
                      <div>
                        <span className="font-mono font-bold">{appliedPromo.code}</span>: {appliedPromo.description}
                      </div>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-xs text-rose-600 hover:underline font-semibold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="Promo code (e.g. KARIBU10)"
                        className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg uppercase placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                      <button
                        onClick={() => applyPromoCode(promoCodeInput)}
                        className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[11px] text-rose-600">{promoError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Option Selector */}
              <div className="pt-2 border-t border-stone-200/80">
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                  Delivery Destination
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    onClick={() => setDeliveryOption('nairobi')}
                    className={`p-1.5 rounded-lg border text-center font-medium transition-all ${
                      deliveryOption === 'nairobi'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    Nairobi/Kiambu
                    <span className="block text-[10px] text-stone-500">
                      {isFreeDeliveryEligible || appliedPromo?.freeDelivery ? 'FREE' : 'KSh 250'}
                    </span>
                  </button>

                  <button
                    onClick={() => setDeliveryOption('pickup')}
                    className={`p-1.5 rounded-lg border text-center font-medium transition-all ${
                      deliveryOption === 'pickup'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    Ruiru Factory
                    <span className="block text-[10px] text-emerald-700 font-bold">FREE Pickup</span>
                  </button>

                  <button
                    onClick={() => setDeliveryOption('nationwide')}
                    className={`p-1.5 rounded-lg border text-center font-medium transition-all ${
                      deliveryOption === 'nationwide'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    Nationwide
                    <span className="block text-[10px] text-stone-500">
                      {isFreeDeliveryEligible ? 'KSh 150' : 'KSh 450'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">KSh {cartSubtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>- KSh {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-slate-800">
                    {actualDeliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `KSh ${actualDeliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-stone-300">
                  <span>Total Due</span>
                  <span className="text-base text-aberdares-forest">
                    KSh {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 px-4 bg-aberdares-forest hover:bg-aberdares-dark text-white rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  M-Pesa STK Push Secured
                </span>
                <span>•</span>
                <span>KEBS Certified Quality</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
