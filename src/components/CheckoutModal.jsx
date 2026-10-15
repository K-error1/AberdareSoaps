import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  Banknote, 
  Truck, 
  MapPin, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Copy,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    actualDeliveryFee,
    cartTotal,
    appliedPromo,
    deliveryOption,
    setDeliveryOption,
    createOrder,
    setIsTrackingOpen
  } = useCart();
  const { user, isAuthenticated, openLogin } = useAuth();

  // Form Fields - Clean initial state without mock defaults
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    county: '',
    town: '',
    address: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // 'mpesa', 'card', 'cod'
  const [stkState, setStkState] = useState('idle'); // 'idle', 'pushing', 'prompting', 'success', 'failed'
  const [stkPhone, setStkPhone] = useState('');
  const [stkCountdown, setStkCountdown] = useState(15);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const deliveryMethodNames = {
    nairobi: 'Nairobi & Kiambu Same-Day Express (Van Delivery)',
    pickup: 'Self-Pickup at Ruiru Factory (Kimbo – Matangi Road)',
    nationwide: 'Nationwide Courier (G4S / Wells Fargo / Speedaf)'
  };

  const paymentMethodNames = {
    mpesa: 'M-Pesa STK Push (Mobile Money)',
    card: 'Credit / Debit Card (Visa / Mastercard)',
    cod: 'Cash / M-Pesa on Delivery'
  };

  // Trigger simulated M-Pesa STK Push
  const handleInitiateMpesa = () => {
    setStkState('pushing');
    setStkCountdown(12);

    setTimeout(() => {
      setStkState('prompting');
      
      // Auto countdown
      const interval = setInterval(() => {
        setStkCountdown(c => {
          if (c <= 1) {
            clearInterval(interval);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }, 1200);
  };

  // Simulated user PIN entry approval
  const handleApproveStk = () => {
    setStkState('success');
    finalizeOrder('mpesa');
  };

  const finalizeOrder = (method) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedOrder = createOrder({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: `${formData.address}, ${formData.town}, ${formData.county}`,
        deliveryMethodName: deliveryMethodNames[deliveryOption],
        paymentMethodName: paymentMethodNames[method || paymentMethod],
        mpesaRef: method === 'mpesa' ? `SKH${Math.floor(10000000 + Math.random() * 90000000)}` : null
      });

      setConfirmedOrder(generatedOrder);
      setIsSubmitting(false);
      setStkState('idle');
    }, 1000);
  };

  const handleRegularSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'mpesa') {
      handleInitiateMpesa();
    } else {
      finalizeOrder(paymentMethod);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(null);
    setStkState('idle');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 my-2 sm:my-8 animate-fadeIn">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-aberdares-dark to-aberdares-forest p-4 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-emerald-300">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight">
                {confirmedOrder ? 'Order Confirmed!' : 'Express Secure Checkout'}
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-200/80">
                Aberdares Soaps • Factory Direct from Ruiru, Kenya
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-stone-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-7 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
          {confirmedOrder ? (
            /* Order Success View */
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-2 py-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce-short">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-black text-slate-800">
                  Asante Sana, {confirmedOrder.customerName}!
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Your order has been received at our Ruiru manufacturing facility and is being prepped for dispatch.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs font-mono font-bold text-slate-800">
                  Order ID: <span className="text-emerald-700">{confirmedOrder.id}</span>
                </div>
              </div>

              {/* Realistic Kenyan SMS Notification Simulation Box */}
              <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 sm:p-5 text-xs font-mono shadow-inner border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-400 pb-1 border-b border-stone-800">
                  <span className="flex items-center gap-1">
                    <Smartphone size={12} className="text-emerald-400" />
                    SMS Notification Simulator
                  </span>
                  <span>Just now</span>
                </div>
                <p className="leading-relaxed text-emerald-400">
                  <strong>ABERDARES:</strong> Confirmed. Order <span className="text-white underline">{confirmedOrder.id}</span> of KES {confirmedOrder.total.toLocaleString()} placed successfully.
                  {confirmedOrder.mpesaRef && ` Ref: ${confirmedOrder.mpesaRef}.`} Dispatching to {confirmedOrder.customerName}, {confirmedOrder.deliveryAddress}. Thank you for supporting Kenyan natural manufacturing!
                </p>
              </div>

              {/* Order Breakdown Card */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200 font-semibold text-slate-700">
                  <span>Delivery Method</span>
                  <span className="text-right text-stone-900">{confirmedOrder.deliveryMethod}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-stone-200 font-semibold text-slate-700">
                  <span>Payment Status</span>
                  <span className="text-emerald-700 font-bold">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-slate-700">
                  <span>Total Paid</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    KSh {confirmedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    setIsTrackingOpen(true);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Truck size={15} /> Track Delivery Progress
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleRegularSubmit} className="space-y-6">
              
              {/* Order Quick Summary Header */}
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Basket Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Subtotal: KSh {cartSubtotal.toLocaleString()} • Delivery: {actualDeliveryFee === 0 ? 'FREE' : `KSh ${actualDeliveryFee}`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Total Due</span>
                  <span className="text-lg font-black text-aberdares-forest">
                    KSh {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Step 1: Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                    Recipient Contact Details
                  </h3>
                  {isAuthenticated ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Signed in as {user?.email}
                      </span>
                      {(user?.name || user?.phone || user?.email) && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              fullName: user.name || prev.fullName,
                              phone: user.phone || prev.phone,
                              email: user.email || prev.email
                            }));
                            if (user.phone) setStkPhone(user.phone);
                          }}
                          className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold underline transition-colors"
                        >
                          Use my profile
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={openLogin}
                      className="text-[11px] text-emerald-800 hover:underline font-semibold"
                    >
                      Already have an account? Sign In
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Recipient's Full Name"
                      className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      M-Pesa / Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        handleInputChange(e);
                        setStkPhone(e.target.value);
                      }}
                      placeholder="07XX XXX XXX or 2547XX"
                      className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (for tax invoice & receipt)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Step 2: Delivery Destination */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                  Delivery Destination
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    deliveryOption === 'nairobi' ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold' : 'border-stone-200 bg-stone-50'
                  }`}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryOption === 'nairobi'}
                      onChange={() => setDeliveryOption('nairobi')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-1.5 mb-1">
                      <Truck size={14} className="text-emerald-700" />
                      <span>Nairobi / Kiambu</span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-normal">
                      Doorstep dispatch: {actualDeliveryFee === 0 ? 'FREE' : 'KSh 250'}
                    </p>
                  </label>

                  <label className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    deliveryOption === 'pickup' ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold' : 'border-stone-200 bg-stone-50'
                  }`}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryOption === 'pickup'}
                      onChange={() => setDeliveryOption('pickup')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin size={14} className="text-emerald-700" />
                      <span>Factory Pickup</span>
                    </div>
                    <p className="text-[10px] text-emerald-700 font-bold">
                      Ruiru Kimbo (FREE)
                    </p>
                  </label>

                  <label className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    deliveryOption === 'nationwide' ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold' : 'border-stone-200 bg-stone-50'
                  }`}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryOption === 'nationwide'}
                      onChange={() => setDeliveryOption('nationwide')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-1.5 mb-1">
                      <Truck size={14} className="text-emerald-700" />
                      <span>Nationwide</span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-normal">
                      Courier: KSh {actualDeliveryFee}
                    </p>
                  </label>
                </div>

                {deliveryOption !== 'pickup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        County & City *
                      </label>
                      <input
                        type="text"
                        name="county"
                        required
                        value={formData.county}
                        onChange={handleInputChange}
                        placeholder="e.g. Nairobi / Kiambu / Nakuru"
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Estate / Area / Town *
                      </label>
                      <input
                        type="text"
                        name="town"
                        required
                        value={formData.town}
                        onChange={handleInputChange}
                        placeholder="e.g. Westlands, Ruiru, Kilimani"
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Street, Building & Door / Landmark *
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="e.g. Street name, building, apartment / house number"
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Payment Method */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">3</span>
                  Payment Method
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'mpesa'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Smartphone size={20} className={paymentMethod === 'mpesa' ? 'text-emerald-700' : 'text-stone-400'} />
                    <span className="text-xs font-bold">Lipa na M-Pesa</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">STK Push</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <CreditCard size={20} className={paymentMethod === 'card' ? 'text-emerald-700' : 'text-stone-400'} />
                    <span className="text-xs font-bold">Card</span>
                    <span className="text-[10px] text-stone-500">Visa / Mastercard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Banknote size={20} className={paymentMethod === 'cod' ? 'text-emerald-700' : 'text-stone-400'} />
                    <span className="text-xs font-bold">Pay on Delivery</span>
                    <span className="text-[10px] text-stone-500">Cash or M-Pesa</span>
                  </button>
                </div>

                {/* M-Pesa Details Box */}
                {paymentMethod === 'mpesa' && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Smartphone size={14} className="text-emerald-700" />
                        Safaricom M-Pesa STK Push
                      </span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                        Instant Prompt
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px]">
                      When you tap "Place Order & Pay with M-Pesa", a prompt will pop up on your phone ({stkPhone || formData.phone}) asking you to enter your M-Pesa PIN.
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <input
                        type="tel"
                        value={stkPhone}
                        onChange={(e) => setStkPhone(e.target.value)}
                        placeholder="07XX XXX XXX"
                        className="px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-mono font-bold text-slate-800"
                      />
                      <span className="text-[10px] text-stone-500">Phone to bill</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-stone-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-aberdares-forest hover:bg-aberdares-dark text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Securing Order...</span>
                    </>
                  ) : paymentMethod === 'mpesa' ? (
                    <>
                      <span>Place Order & Pay with M-Pesa (KSh {cartTotal.toLocaleString()})</span>
                      <ArrowRight size={16} />
                    </>
                  ) : (
                    <>
                      <span>Confirm Order (KSh {cartTotal.toLocaleString()})</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-stone-400 text-center mt-2.5 flex items-center justify-center gap-1">
                  <Lock size={12} /> 256-Bit SSL Encrypted • Direct from Aberdares Ruiru Works
                </p>
              </div>

            </form>
          )}
        </div>

      </div>

      {/* M-PESA STK PUSH LIVE SIMULATOR MODAL */}
      {stkState !== 'idle' && stkState !== 'failed' && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-stone-900 text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-700 text-center space-y-4">
            
            <div className="w-14 h-14 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-pulse">
              <Smartphone size={28} />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                Safaricom M-Pesa STK
              </span>
              <h4 className="text-lg font-bold text-white mt-1">
                Prompt Sent to {stkPhone || formData.phone}
              </h4>
            </div>

            {/* Simulated Phone Prompt Dialog */}
            <div className="bg-stone-800 rounded-2xl p-4 border border-stone-700 text-left text-xs font-mono space-y-2">
              <div className="text-emerald-400 font-bold flex items-center justify-between">
                <span>SIM TOOLKIT</span>
                <span className="text-stone-400 text-[10px]">{stkCountdown}s</span>
              </div>
              <p className="text-stone-300 text-xs">
                Do you want to pay <strong>KES {cartTotal.toLocaleString()}</strong> to <strong>ABERDARES SOAPS</strong> (Paybill 892110) for Account ABS-NEW?
              </p>
              <div className="pt-2">
                <span className="text-[10px] text-stone-400 block mb-1">ENTER M-PESA PIN:</span>
                <div className="bg-stone-950 border border-stone-600 px-3 py-1.5 rounded-lg text-stone-200 tracking-widest text-center text-sm">
                  ••••
                </div>
              </div>
            </div>

            <p className="text-[11px] text-stone-400">
              Please check your phone screen and enter your PIN, or click authorize below to simulate approval.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleApproveStk}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow"
              >
                Approve & Pay PIN
              </button>
              <button
                type="button"
                onClick={() => setStkState('idle')}
                className="px-3 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-400 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
