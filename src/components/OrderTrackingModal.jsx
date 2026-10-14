import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const OrderTrackingModal = () => {
  const { isTrackingOpen, setIsTrackingOpen, lookupOrder, orders } = useCart();
  const [searchId, setSearchId] = useState(orders[0]?.id || 'ABS-7421');
  const [queriedOrder, setQueriedOrder] = useState(orders[0] || null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isTrackingOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const found = lookupOrder(searchId);
    if (found) {
      setQueriedOrder(found);
    } else {
      setErrorMsg(`No order found matching "${searchId.toUpperCase()}". Try sample order: ABS-7421`);
      setQueriedOrder(null);
    }
  };

  const steps = [
    { label: "Order Received", sub: "Ruiru Factory Desk", done: true },
    { label: "Formulation & QC", sub: "KEBS Verified", done: true },
    { label: "Packaging & Sealed", sub: "Kimbo Facility", done: true },
    { label: "Out for Delivery", sub: "Local Van / Courier", done: queriedOrder?.statusCode !== 'processing' },
    { label: "Delivered", sub: "Recipient Signed", done: queriedOrder?.statusCode === 'delivered' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Truck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">Aberdares Live Order Tracking</h2>
              <p className="text-xs text-stone-400">Real-time dispatch from Ruiru, Kimbo – Matangi Road</p>
            </div>
          </div>
          <button 
            onClick={() => setIsTrackingOpen(false)}
            className="text-stone-400 hover:text-white p-1.5 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-5 sm:p-6 border-b border-stone-100 bg-stone-50">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. ABS-7421)..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search size={16} className="absolute left-3 top-3 text-stone-400" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-aberdares-forest hover:bg-aberdares-deep text-white font-bold text-xs rounded-xl transition-colors"
            >
              Track
            </button>
          </form>

          {errorMsg && (
            <div className="mt-2 text-xs text-rose-600 flex items-center gap-1.5">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Order Progress Details */}
        <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto space-y-6">
          {queriedOrder ? (
            <div className="space-y-6">
              
              {/* Status Header Pill */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Current Fulfillment Status
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {queriedOrder.status}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 block">Estimated Delivery</span>
                  <span className="text-xs font-bold text-emerald-900">Today before 5:00 PM</span>
                </div>
              </div>

              {/* Step Timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.done 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-stone-200 text-stone-500'
                    }`}>
                      {step.done ? <CheckCircle2 size={12} /> : idx + 1}
                    </div>
                    <div>
                      <h5 className={`text-xs font-bold ${step.done ? 'text-slate-900' : 'text-stone-400'}`}>
                        {step.label}
                      </h5>
                      <p className="text-[11px] text-stone-500">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Metadata */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2.5">
                <div className="flex justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Order ID:</span>
                  <span className="font-mono font-bold text-slate-800">{queriedOrder.id}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Recipient:</span>
                  <span className="font-semibold text-slate-800">{queriedOrder.customerName} ({queriedOrder.phone})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Destination:</span>
                  <span className="font-semibold text-slate-800 text-right max-w-xs">{queriedOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment Ref:</span>
                  <span className="font-mono font-bold text-emerald-800">{queriedOrder.mpesaRef || 'M-Pesa Verified'}</span>
                </div>
              </div>

              {/* Items in this order */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Items in Package ({queriedOrder.items?.length || 0})
                </h5>
                <div className="space-y-1.5">
                  {queriedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs py-1 border-b border-stone-100">
                      <span className="text-slate-700">
                        {item.quantity}x {item.name} ({item.size})
                      </span>
                      <span className="font-bold text-slate-900">
                        KSh {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};
