import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Search, 
  Heart, 
  Truck, 
  Award, 
  ChevronDown,
  User,
  LogOut
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activePage, setActivePage, onSearchChange, searchQuery }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { 
    totalItemsCount, 
    setIsCartOpen, 
    wishlist, 
    setIsTrackingOpen, 
    setIsWholesaleModalOpen,
    greenPoints 
  } = useCart();
  const { user, isAuthenticated, openLogin, logout } = useAuth();

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Shop Products' },
    { id: 'about', label: 'About Us' },
    { id: 'wholesale', label: 'Wholesale & B2B' },
    { id: 'sustainability', label: 'CSR & Eco' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'blog', label: 'Insights' },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-aberdares-dark text-stone-200 text-xs py-1.5 sm:py-2 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <span className="bg-aberdares-emerald/80 text-white font-bold px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] tracking-wider uppercase flex-shrink-0">
              Factory Direct
            </span>
            <span className="truncate">Ruiru, Kimbo – Matangi Rd</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-300">
              <Truck size={13} /> Free delivery over KSh 3,000
            </span>
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="hover:text-white underline underline-offset-2 flex items-center gap-1 transition-colors text-[11px] sm:text-xs"
            >
              Track Order
            </button>
            <span className="text-stone-500">|</span>
            <a 
              href="tel:+254712792555" 
              className="flex items-center gap-1 hover:text-white transition-colors text-[11px] sm:text-xs font-semibold"
            >
              <Phone size={11} /> 0712 792 555
            </a>
          </div>
        </div>
      </div>

      {/* Top Row: Brand & Utilities */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4 lg:gap-8">
          
          {/* Logo (Left) */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-aberdares-forest to-aberdares-dark text-white flex items-center justify-center shadow-md shadow-aberdares-forest/20 group-hover:scale-105 transition-transform flex-shrink-0">
              {/* Mountain & Botanical Leaf SVG */}
              <svg className="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 64 64" fill="none">
                <path d="M12 44L26 22L36 34L42 26L52 44H12Z" fill="#74c69d" opacity="0.6"/>
                <path d="M22 44L34 26L46 44H22Z" fill="#ffffff" />
                <path d="M34 22C34 22 44 28 44 38C44 42 41 45 36 45C30 45 28 40 28 40C28 40 30 32 34 22Z" fill="#f07167" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-aberdares-dark">
                  ABERDARES
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-aberdares-forest uppercase tracking-wider">
                  Soaps
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-stone-500 font-medium tracking-wider uppercase -mt-0.5">
                Nature Meets Innovation
              </p>
            </div>
          </div>

          {/* Search Bar (Center) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activePage !== 'products') setActivePage('products');
                }}
                placeholder="Search soaps, bleaches, sizes (e.g. 250g, aloe)..."
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-stone-100/90 border border-stone-200/90 rounded-full focus:outline-none focus:ring-2 focus:ring-aberdares-forest/30 focus:bg-white focus:border-aberdares-forest/40 transition-all placeholder:text-stone-400"
              />
              <Search size={16} className="absolute left-3.5 top-2.5 sm:top-3 text-stone-400" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 sm:top-3 text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Header Action Tools (Right) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-stone-600 hover:text-aberdares-forest md:hidden"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Track Order Quick Link (Desktop) */}
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-aberdares-forest hover:bg-stone-100/80 rounded-xl transition-colors"
            >
              <Truck size={15} />
              <span>Track Order</span>
            </button>

            {/* User Account / Login Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 bg-stone-100 py-1 px-2.5 rounded-xl text-xs">
                <button
                  onClick={() => handleNavClick('account')}
                  className="flex items-center gap-1.5 hover:text-aberdares-forest transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-semibold text-slate-800 hidden sm:inline max-w-[90px] truncate">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="text-stone-400 hover:text-rose-600 p-1 ml-1 transition-colors"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('account')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-aberdares-forest hover:bg-stone-100 rounded-xl transition-colors"
              >
                <User size={16} />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-aberdares-forest transition-colors group"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
              {totalItemsCount > 0 && (
                <span className="bg-aberdares-coral text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:text-aberdares-forest hover:bg-stone-100 lg:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        {searchOpen && (
          <div className="pb-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activePage !== 'products') setActivePage('products');
                }}
                placeholder="Search products, sizes (e.g. 250g, aloe, bleach)..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-100 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-aberdares-forest/40"
                autoFocus
              />
              <Search size={16} className="absolute left-3 top-3 text-stone-400" />
            </div>
          </div>
        )}
      </div>

      {/* Second Row: Navigation Links (Desktop) */}
      <div className="hidden lg:block border-t border-stone-200/70 bg-stone-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-1 xl:gap-2 py-1.5">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                  activePage === link.id
                    ? 'text-aberdares-forest bg-emerald-100/70 font-bold shadow-xs'
                    : 'text-stone-700 hover:text-aberdares-forest hover:bg-stone-200/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 shadow-xl px-4 pt-3 pb-6 animate-fadeIn">
          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between transition-colors ${
                  activePage === link.id
                    ? 'bg-emerald-50 text-aberdares-forest font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{link.label}</span>
                {activePage === link.id && <span className="w-1.5 h-1.5 rounded-full bg-aberdares-forest" />}
              </button>
            ))}

            <div className="my-3 pt-3 border-t border-stone-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsWholesaleModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-amber-600 text-white font-medium text-sm flex items-center justify-center gap-2"
              >
                <Award size={16} /> Request B2B / Wholesale Quote
              </button>
              <button
                onClick={() => {
                  setIsTrackingOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-stone-100 text-stone-700 font-medium text-sm flex items-center justify-center gap-2"
              >
                <Truck size={16} /> Track Existing Order
              </button>
            </div>

            <div className="mt-2 text-xs text-stone-500 flex items-center justify-between px-2 pt-2 border-t border-stone-100">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> Ruiru, Kimbo – Matangi Rd
              </span>
              <span className="font-semibold text-emerald-800">
                Points: {greenPoints}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
