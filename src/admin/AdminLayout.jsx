import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  Users,
  Tag,
  Award,
  CreditCard,
  FileText,
  Settings,
  ArrowLeft,
  Menu,
  X,
  Bell,
  Search,
  ExternalLink,
  ShieldCheck,
  Store,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = ({ 
  activeTab, 
  setActiveTab, 
  onExitToStore,
  children 
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders & Dispatch', icon: ShoppingBag, badge: 'Live' },
    { id: 'inventory', label: 'Inventory & Stock', icon: Boxes },
    { id: 'products', label: 'Product Catalog', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'promos', label: 'Promo & Discounts', icon: Tag },
    { id: 'loyalty', label: 'Green Loyalty Points', icon: Award },
    { id: 'payments', label: 'M-Pesa & Payments', icon: CreditCard },
    { id: 'blog', label: 'Blog & Articles', icon: FileText },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F6F8F7] flex flex-col md:flex-row font-sans text-slate-800">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#0f291e] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-emerald-900/60 text-emerald-200 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-xs">
              A
            </div>
            <span className="font-bold text-sm tracking-wide">Aberdares Admin</span>
          </div>
        </div>
        <button
          onClick={onExitToStore}
          className="flex items-center gap-1 text-xs font-semibold bg-emerald-800/80 hover:bg-emerald-700 px-2.5 py-1.5 rounded-lg text-emerald-100 transition-colors"
        >
          <Store size={14} />
          <span>Store</span>
        </button>
      </header>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0f291e] text-stone-200 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } border-r border-emerald-950/60 shadow-xl`}
      >
        {/* Sidebar Header */}
        <div>
          <div className="p-5 border-b border-emerald-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
                <svg className="w-6 h-6" viewBox="0 0 64 64" fill="none">
                  <path d="M12 44L26 22L36 34L42 26L52 44H12Z" fill="#74c69d" opacity="0.7"/>
                  <path d="M22 44L34 26L46 44H22Z" fill="#ffffff" />
                  <path d="M34 22C34 22 44 28 44 38C44 42 41 45 36 45C30 45 28 40 28 40C28 40 30 32 34 22Z" fill="#f07167" />
                </svg>
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-white leading-none">
                  ABERDARES
                </h1>
                <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mt-1">
                  Ops Management
                </p>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-stone-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Plant / Facility Indicator */}
          <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-emerald-950/70 border border-emerald-800/40 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-stone-300 font-medium">Ruiru Kimbo Plant</span>
            </div>
            <span className="text-emerald-400 font-bold uppercase text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/60">
              Online
            </span>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 mt-2 overflow-y-auto max-h-[calc(100vh-270px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-stone-300 hover:bg-emerald-900/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} className={isActive ? 'text-white' : 'text-emerald-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with User Info & Back to Store */}
        <div className="p-4 border-t border-emerald-900/50 bg-[#0b1f16]/90 space-y-2.5">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-emerald-950/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono truncate">
                  {user?.email || 'admin@aberdares.co.ke'}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout && logout()}
              title="Sign Out"
              className="text-stone-400 hover:text-rose-400 p-1 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>

          <button
            onClick={onExitToStore}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
          >
            <ArrowLeft size={14} />
            <span>Return to Storefront</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex items-center justify-between bg-white px-8 py-4 border-b border-stone-200/80 sticky top-0 z-30 shadow-xs">
          <div>
            <h2 className="text-xl font-black text-slate-900 capitalize tracking-tight">
              {navItems.find(n => n.id === activeTab)?.label || 'Admin Panel'}
            </h2>
            <p className="text-xs text-stone-500">
              Aberdares Soaps & Detergents Operations & Analytics Control Center
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Quick search orders, SKUs..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-100 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-stone-400" />
            </div>

            <button
              onClick={onExitToStore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all bg-stone-50"
            >
              <Store size={14} />
              <span>View Storefront</span>
              <ExternalLink size={12} className="text-stone-400" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
