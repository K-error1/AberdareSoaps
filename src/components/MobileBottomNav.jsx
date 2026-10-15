import React from 'react';
import { Home, ShoppingBag, Truck, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const MobileBottomNav = ({ activePage, setActivePage }) => {
  const { totalItemsCount, setIsCartOpen, setIsTrackingOpen } = useCart();
  const { user, isAuthenticated } = useAuth();

  const handleNav = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Mobile Navigation Bar" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {/* Home */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activePage === 'home' ? 'text-aberdares-forest font-bold' : 'text-stone-500 hover:text-slate-800'
          }`}
        >
          <Home size={20} className={activePage === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => handleNav('products')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activePage === 'products' ? 'text-aberdares-forest font-bold' : 'text-stone-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag size={20} className={activePage === 'products' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          <span className="text-[10px] tracking-tight">Shop</span>
        </button>

        {/* Track Order */}
        <button
          onClick={() => setIsTrackingOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-aberdares-forest transition-colors"
        >
          <Truck size={20} className="stroke-[1.8]" />
          <span className="text-[10px] tracking-tight">Track</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-aberdares-forest transition-colors"
        >
          <div className="relative">
            <ShoppingCart size={20} className="stroke-[1.8]" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-aberdares-coral text-white text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Cart</span>
        </button>

        {/* Account */}
        <button
          onClick={() => handleNav('account')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activePage === 'account' ? 'text-aberdares-forest font-bold' : 'text-stone-500 hover:text-slate-800'
          }`}
        >
          {isAuthenticated ? (
            <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          ) : (
            <User size={20} className={activePage === 'account' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          )}
          <span className="text-[10px] tracking-tight">
            {isAuthenticated ? 'Profile' : 'Account'}
          </span>
        </button>
      </div>
    </nav>
  );
};
