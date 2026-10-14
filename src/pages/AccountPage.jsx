import React, { useState } from 'react';
import { Lock, Mail, Phone, ArrowLeft, Loader2, AlertCircle, Eye, EyeOff, User, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AccountPage = ({ setActivePage, previousPage = 'home' }) => {
  const {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loading,
    authError,
    setAuthError
  } = useAuth();

  // Multi-step Jumia style flow:
  // 1. 'identifier' (Email or Mobile Number input)
  // 2. 'login' (Enter existing password)
  // 3. 'register' (New user enters full name & sets password)
  const [step, setStep] = useState('identifier'); // 'identifier', 'login', 'register'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleIdentifierSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    const clean = identifier.trim();
    if (!clean) {
      setAuthError('Please enter your email or mobile number.');
      return;
    }
    // Proceed to password login step (user can toggle to register if new)
    setStep('login');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const emailToUse = isEmail(identifier) ? identifier.trim() : `${identifier.replace(/\D/g, '')}@aberdares.co.ke`;
      await login(emailToUse, password);
    } catch {
      // Error handled by AuthContext
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const isMail = isEmail(identifier);
      const email = isMail ? identifier.trim() : `${identifier.replace(/\D/g, '')}@aberdares.co.ke`;
      const phone = !isMail ? identifier.trim() : '';

      await register({
        email,
        phone,
        name: fullName || 'Valued Customer',
        password
      });
    } catch {
      // Error handled by AuthContext
    }
  };

  const handleGoogleSignIn = () => {
    setAuthError('Google (Gmail) sign-in will connect to Google OAuth2 API.');
  };

  const handleBackToStore = () => {
    const target = previousPage === 'account' ? 'home' : (previousPage || 'home');
    if (setActivePage) {
      setActivePage(target);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-slate-800 px-4 py-8 sm:py-12">
      
      {/* Top minimal bar to return to store */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between pb-4">
        <button
          onClick={handleBackToStore}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-aberdares-forest transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Store</span>
        </button>

        <div 
          onClick={() => setActivePage && setActivePage('home')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aberdares-forest to-aberdares-dark flex items-center justify-center text-white shadow-xs">
            {/* Aberdares Mountain & Leaf SVG */}
            <svg className="w-5 h-5" viewBox="0 0 64 64" fill="none">
              <path d="M12 44L26 22L36 34L42 26L52 44H12Z" fill="#74c69d" opacity="0.6"/>
              <path d="M22 44L34 26L46 44H22Z" fill="#ffffff" />
              <path d="M34 22C34 22 44 28 44 38C44 42 41 45 36 45C30 45 28 40 28 40C28 40 30 32 34 22Z" fill="#f07167" />
            </svg>
          </div>
          <span className="font-extrabold text-sm tracking-tight text-aberdares-dark">
            ABERDARES <span className="text-emerald-700 font-normal">SOAPS</span>
          </span>
        </div>

        <div className="w-16" /> {/* Spacer */}
      </div>

      {isAuthenticated ? (
        /* LOGGED IN USER PROFILE */
        <div className="max-w-xl w-full mx-auto my-auto space-y-6 animate-fadeIn py-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-aberdares-forest to-aberdares-dark text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md shadow-emerald-900/10">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-xs text-stone-500">{user?.email}</p>
          </div>

          <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-stone-200/80 space-y-4 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-stone-200">
              <span className="text-stone-500">Phone Number:</span>
              <span className="font-bold text-slate-800">{user?.phone || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-stone-200">
              <span className="text-stone-500">Account Role:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {user?.role || 'CUSTOMER'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-stone-200">
              <span className="text-stone-500">Member Status:</span>
              <span className="font-semibold text-emerald-700">Verified Customer</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (setActivePage) setActivePage('products');
                }}
                className="flex-1 py-3 px-4 bg-aberdares-forest hover:bg-aberdares-dark text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={logout}
                className="py-3 px-6 bg-white border border-stone-200 hover:bg-rose-50 hover:text-rose-600 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* JUMIA-STYLE CLEAN FLOW IN ABERDARES BOTANICAL BRANDING */
        <div className="max-w-[420px] w-full mx-auto my-auto space-y-6 animate-fadeIn py-4">
          
          {/* Circular Brand Icon Header using Aberdares Mountain & Leaf Logo */}
          <div className="text-center space-y-2.5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-aberdares-forest to-aberdares-dark text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-950/20">
              <svg className="w-9 h-9" viewBox="0 0 64 64" fill="none">
                <path d="M12 44L26 22L36 34L42 26L52 44H12Z" fill="#74c69d" opacity="0.6"/>
                <path d="M22 44L34 26L46 44H22Z" fill="#ffffff" />
                <path d="M34 22C34 22 44 28 44 38C44 42 41 45 36 45C30 45 28 40 28 40C28 40 30 32 34 22Z" fill="#f07167" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome to Aberdares
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed">
              {step === 'identifier' && "Use your email or phone to log in or sign up."}
              {step === 'login' && `Enter your password to sign in for ${identifier}.`}
              {step === 'register' && `Create your new account for ${identifier}.`}
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* STEP 1: Enter Email or Phone (Floating Label Input styled in Aberdares Forest Green) */}
          {step === 'identifier' && (
            <form onSubmit={handleIdentifierSubmit} className="space-y-5">
              <div className="relative pt-2">
                <div className="relative border-2 border-aberdares-forest rounded-xl bg-white px-3.5 py-3 focus-within:ring-2 focus-within:ring-aberdares-forest/20 transition-all">
                  <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-bold text-aberdares-forest">
                    Email or Mobile Number*
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. name@domain.com or 0712 345 678"
                    className="w-full text-sm font-medium text-slate-900 focus:outline-none bg-transparent"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-aberdares-forest hover:bg-aberdares-dark text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Continue</span>
              </button>
            </form>
          )}

          {/* STEP 2: Password entry for Login */}
          {step === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('identifier');
                    setAuthError('');
                  }}
                  className="flex items-center gap-1 text-stone-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft size={14} /> Change {identifier}
                </button>
              </div>

              <div className="relative border-2 border-aberdares-forest rounded-xl bg-white px-3.5 py-3 flex items-center focus-within:ring-2 focus-within:ring-aberdares-forest/20">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none bg-transparent"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-aberdares-forest hover:bg-aberdares-dark text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Log In</span>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('register');
                    setAuthError('');
                  }}
                  className="text-emerald-700 hover:underline font-semibold"
                >
                  New customer? Sign up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('admin@aberdares.co.ke');
                    setPassword('AberdaresAdminPassword2026!');
                  }}
                  className="text-stone-400 hover:underline text-[11px]"
                >
                  Demo credentials
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Register New User */}
          {step === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('identifier');
                    setAuthError('');
                  }}
                  className="flex items-center gap-1 text-stone-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('login');
                    setAuthError('');
                  }}
                  className="text-emerald-700 hover:underline font-semibold"
                >
                  Already have an account? Log In
                </button>
              </div>

              <div className="border border-stone-300 rounded-xl bg-white px-3.5 py-2.5 focus-within:border-aberdares-forest">
                <label className="text-[10px] font-bold text-stone-500 uppercase block">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Wambui"
                  className="w-full text-xs font-medium text-slate-900 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="border border-stone-300 rounded-xl bg-white px-3.5 py-2.5 flex items-center focus-within:border-aberdares-forest">
                <div className="w-full">
                  <label className="text-[10px] font-bold text-stone-500 uppercase block">Create Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-aberdares-forest hover:bg-aberdares-dark text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account & Continue</span>
                )}
              </button>
            </form>
          )}

          {/* Divider: "Or log in with" */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-stone-400">Or log in with</span>
            </div>
          </div>

          {/* Social Log In Option: Google (Gmail) */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 border border-stone-300 hover:border-emerald-700/50 hover:bg-stone-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-xs"
            >
              {/* Google multicolor 'G' Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google (Gmail)</span>
            </button>
          </div>

          {/* Terms & Conditions */}
          <div className="text-center text-[11px] text-stone-500 space-y-3 pt-2">
            <p>
              By continuing you agree to Aberdares Soaps' <br />
              <button
                type="button"
                onClick={() => setActivePage && setActivePage('about')}
                className="text-emerald-700 hover:underline font-medium"
              >
                Terms and Conditions
              </button>
            </p>
          </div>

        </div>
      )}

      {/* Clean Bottom Help Contact Line using official Aberdares store contacts */}
      <footer className="text-center text-xs text-stone-600 pt-8 pb-4">
        <p>
          Need help? Contact Aberdares Customer Desk on{' '}
          <a href="tel:+254712792555" className="font-bold text-slate-900 hover:text-aberdares-forest hover:underline">
            +254 712 792 555
          </a>{' '}
          or email{' '}
          <a href="mailto:info@aberdarecleaners.co.ke" className="font-bold text-slate-900 hover:text-aberdares-forest hover:underline">
            info@aberdarecleaners.co.ke
          </a>
        </p>
      </footer>

    </div>
  );
};
