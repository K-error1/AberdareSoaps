import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProductsPage } from './pages/ProductsPage';
import { CustomersPage } from './pages/CustomersPage';
import { PromoCodesPage } from './pages/PromoCodesPage';
import { LoyaltyPage } from './pages/LoyaltyPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { BlogAdminPage } from './pages/BlogAdminPage';
import { SettingsPage } from './pages/SettingsPage';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  LogOut,
  Building2
} from 'lucide-react';

export const AdminApp = ({ setActivePage }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, login, logout, loading } = useAuth();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current user is an authorized admin
  const isAdmin = Boolean(
    user && (user.role === 'ADMIN' || user.is_staff || user.is_superuser)
  );

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError('Please enter both your admin email and password.');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      const loggedUser = await login(email.trim(), password);
      // Verify role
      if (loggedUser.role !== 'ADMIN' && !loggedUser.is_staff && !loggedUser.is_superuser) {
        await logout();
        setLoginError('Access Denied: This account is registered as a customer and does not have administrative privileges.');
      }
    } catch (err) {
      const msg = err.details?.message || err.message || 'Login failed. Please verify your credentials.';
      setLoginError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@aberdares.co.ke');
    setPassword('AberdaresAdminPassword2026!');
    setLoginError('');
  };

  const handleExit = () => {
    if (setActivePage) {
      setActivePage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Case 1: User is logged in as a normal CUSTOMER (Restricted access)
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a1a13] text-stone-100 flex items-center justify-center p-4">
        <div className="bg-[#0f291e] border border-amber-500/40 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span>Restricted Operations Area</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Administrator Access Required
            </h2>
            <p className="text-xs text-stone-400">
              You are currently authenticated as a standard customer account. The operations panel is restricted to authorized plant supervisors and staff.
            </p>
          </div>

          {/* Current User Snapshot */}
          <div className="p-4 rounded-2xl bg-black/30 border border-emerald-900/40 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-400">Signed In As:</span>
              <span className="font-bold text-white">{user.name || 'Customer'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-400">Email:</span>
              <span className="font-mono text-emerald-300 text-[11px]">{user.email}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-400">Account Role:</span>
              <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-bold text-[10px] uppercase">
                {user.role || 'CUSTOMER'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => logout()}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              <span>Sign Out & Switch to Admin Account</span>
            </button>

            <button
              onClick={handleExit}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Return to Public Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Not logged in at all (Show Dedicated Admin Login Screen)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#07150f] text-stone-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Subtle background ambient lights */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-emerald-700/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-teal-800/15 blur-3xl pointer-events-none" />

        <div className="bg-[#0e271d] border border-emerald-900/60 p-6 sm:p-9 rounded-3xl max-w-md w-full shadow-2xl space-y-6 relative z-10 animate-in zoom-in-95">
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-950/50">
              <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none">
                <path d="M12 44L26 22L36 34L42 26L52 44H12Z" fill="#74c69d" opacity="0.7"/>
                <path d="M22 44L34 26L46 44H22Z" fill="#ffffff" />
                <path d="M34 22C34 22 44 28 44 38C44 42 41 45 36 45C30 45 28 40 28 40C28 40 30 32 34 22Z" fill="#f07167" />
              </svg>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1 border border-emerald-500/30">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>Authorized Staff Portal</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Aberdares Operations Console
              </h1>
              <p className="text-xs text-stone-400 mt-1">
                Ruiru Manufacturing Plant • E-Commerce Administration
              </p>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aberdares.co.ke"
                  className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-emerald-950 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium placeholder:text-stone-600"
                />
                <Mail size={16} className="absolute left-3.5 top-3 text-stone-500" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-stone-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-emerald-950 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono placeholder:text-stone-600"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-stone-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-stone-500 hover:text-stone-300"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting || loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Admin Console</span>
              )}
            </button>
          </form>

          {/* Quick-Fill Admin Credentials Helper */}
          <div className="pt-2 border-t border-emerald-950/60 space-y-3">
            <button
              type="button"
              onClick={handleQuickFill}
              className="w-full py-2 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Quick-Fill Demo Admin Credentials</span>
            </button>

            <button
              type="button"
              onClick={handleExit}
              className="w-full py-2 text-stone-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Public Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Authorized Admin (Render full Admin Dashboard & Layout)
  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onExitToStore={handleExit}
    >
      {activeTab === 'dashboard' && (
        <DashboardPage
          setActiveTab={setActiveTab}
          onViewOrder={() => setActiveTab('orders')}
        />
      )}

      {activeTab === 'orders' && <OrdersPage />}

      {activeTab === 'inventory' && <InventoryPage />}

      {activeTab === 'products' && <ProductsPage />}

      {activeTab === 'customers' && <CustomersPage />}

      {activeTab === 'promos' && <PromoCodesPage />}

      {activeTab === 'loyalty' && <LoyaltyPage />}

      {activeTab === 'payments' && <PaymentsPage />}

      {activeTab === 'blog' && <BlogAdminPage />}

      {activeTab === 'settings' && <SettingsPage />}
    </AdminLayout>
  );
};
