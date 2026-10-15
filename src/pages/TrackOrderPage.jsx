import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Phone,
  Check,
  ArrowLeft
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

const FULFILLMENT_STEPS = [
  { key: 'RECEIVED', label: 'Order Received', sub: 'Ruiru Factory Desk', stepNum: 1 },
  { key: 'PACKAGED', label: 'Packaging & Sealed', sub: 'Kimbo Facility', stepNum: 2 },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', sub: 'Local Van / Courier', stepNum: 3 },
  { key: 'DELIVERED', label: 'Delivered', sub: 'Recipient Signed', stepNum: 4 }
];

export const TrackOrderPage = ({ setActivePage, initialOrderId = '' }) => {
  const { lookupOrder, orders } = useCart();
  const [searchId, setSearchId] = useState('');
  const [queriedOrder, setQueriedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check URL hash or query params
    let orderFromUrl = initialOrderId;
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = new URLSearchParams(window.location.search);
      if (hash.startsWith('#track-')) {
        orderFromUrl = hash.replace('#track-', '');
      } else if (search.get('order')) {
        orderFromUrl = search.get('order');
      }
    }

    const defaultId = orderFromUrl || orders[0]?.id || 'ABS-9169';
    setSearchId(defaultId);
    performSearch(defaultId);
  }, [initialOrderId]);

  const performSearch = async (queryId) => {
    const cleanId = (queryId || searchId || '').trim().toUpperCase();
    if (!cleanId) {
      setErrorMsg('Please enter an Order ID.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const liveOrder = await api.getOrder(cleanId);
      if (liveOrder && (liveOrder.id || liveOrder.order_number)) {
        setQueriedOrder({
          id: liveOrder.id || liveOrder.order_number,
          customerName: liveOrder.customerName || liveOrder.customer_name || 'Customer',
          phone: liveOrder.phone || liveOrder.customer_phone || '',
          deliveryAddress: liveOrder.deliveryAddress || liveOrder.delivery_address || 'Nairobi',
          deliveryOption: liveOrder.delivery_option || 'Standard Delivery',
          status: liveOrder.status || 'PENDING',
          statusCode: (liveOrder.status || 'pending').toLowerCase(),
          paymentMethod: liveOrder.paymentMethod || liveOrder.payment_method || 'M-Pesa',
          mpesaRef: liveOrder.mpesaRef || liveOrder.mpesa_receipt_number || '',
          total: liveOrder.total || 0,
          items: liveOrder.items || [],
          statusHistory: liveOrder.status_history || [],
          createdAt: liveOrder.created_at
        });
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend order lookup failed, checking local context:', err);
    }

    const localFound = lookupOrder(cleanId);
    if (localFound) {
      setQueriedOrder({
        ...localFound,
        statusCode: (localFound.status || localFound.statusCode || 'pending').toLowerCase()
      });
      setIsLoading(false);
      return;
    }

    setErrorMsg(`No order found matching "${cleanId}". Please check your order code or try sample "ABS-9169".`);
    setQueriedOrder(null);
    setIsLoading(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    performSearch(searchId);
  };

  const getStepProgressIndex = (statusStr) => {
    const s = (statusStr || '').toUpperCase();
    if (s === 'DELIVERED') return 4;
    if (s === 'OUT_FOR_DELIVERY') return 3;
    if (s === 'PACKAGED') return 2;
    if (s === 'RECEIVED' || s === 'PAID' || s === 'PROCESSING') return 1;
    return 0;
  };

  const getStepTimestamp = (stepKey) => {
    if (!queriedOrder?.statusHistory || queriedOrder.statusHistory.length === 0) {
      return null;
    }
    const match = queriedOrder.statusHistory.find(
      (h) => (h.to_status || '').toUpperCase() === stepKey ||
             (stepKey === 'RECEIVED' && ['RECEIVED', 'PAID', 'PROCESSING'].includes((h.to_status || '').toUpperCase()))
    );
    if (match && match.created_at) {
      return new Date(match.created_at).toLocaleString('en-KE', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return null;
  };

  const formatStatusDisplay = (statusStr) => {
    const s = (statusStr || '').toUpperCase();
    if (s === 'RECEIVED' || s === 'PROCESSING') return 'Order Received';
    if (s === 'PACKAGED') return 'Packaged & Sealed';
    if (s === 'OUT_FOR_DELIVERY') return 'Out for Delivery';
    if (s === 'DELIVERED') return 'Delivered';
    if (s === 'PENDING') return 'Pending Confirmation';
    if (s === 'CANCELLED') return 'Order Cancelled';
    return statusStr;
  };

  const getEstimatedDeliveryText = (statusStr) => {
    const s = (statusStr || '').toUpperCase();
    if (s === 'DELIVERED') return 'Delivered Successfully';
    if (s === 'OUT_FOR_DELIVERY') return 'Arriving Today before 5:00 PM';
    if (s === 'PACKAGED') return 'Dispatching within 2-4 Hours';
    if (s === 'RECEIVED' || s === 'PROCESSING') return 'Packaging in Progress at Kimbo';
    return 'Pending Warehouse Confirmation';
  };

  return (
    <div className="py-8 sm:py-12 px-4 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Navigation & Header */}
      <div className="space-y-4">
        {setActivePage && (
          <button
            onClick={() => setActivePage('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-aberdares-forest transition-colors bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs"
          >
            <ArrowLeft size={14} />
            <span>Back to Storefront</span>
          </button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <Truck size={24} />
              </span>
              <span>Live Order Tracking</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Direct dispatch tracking from Aberdares factory and logistics hub in Ruiru, Kimbo
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-soft">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter your Order ID (e.g. ABS-9169)..."
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            <Search size={18} className="absolute left-3.5 top-3.5 text-stone-400" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-aberdares-forest hover:bg-aberdares-deep text-white font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            <span>Track Order</span>
          </button>
        </form>

        {errorMsg && (
          <div className="mt-3 text-xs text-rose-600 flex items-center gap-2 bg-rose-50 p-3 rounded-xl border border-rose-200">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Live Order Details Card */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <Loader2 size={36} className="animate-spin mx-auto text-emerald-600" />
          <p className="text-xs font-semibold text-stone-500">
            Connecting to Ruiru logistics desk to fetch order details...
          </p>
        </div>
      ) : queriedOrder ? (
        <div className="space-y-6">
          {/* Status Header Banner */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Order Status
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {formatStatusDisplay(queriedOrder.status)}
              </h2>
              <p className="text-xs text-stone-400 font-mono">
                Tracking ID: <strong className="text-slate-800">{queriedOrder.id}</strong>
              </p>
            </div>

            <div className="bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100 text-left sm:text-right">
              <span className="text-[11px] text-stone-500 block">Fulfillment ETA</span>
              <span className="text-xs sm:text-sm font-black text-emerald-900">
                {getEstimatedDeliveryText(queriedOrder.status)}
              </span>
            </div>
          </div>

          {/* 4-Step Visual Progress Stepper */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-soft space-y-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Dispatch & Fulfillment Pipeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {FULFILLMENT_STEPS.map((step) => {
                const currentIdx = getStepProgressIndex(queriedOrder.status);
                const isDone = currentIdx >= step.stepNum;
                const isCurrent = currentIdx === step.stepNum - 1 && queriedOrder.statusCode !== 'cancelled';
                const timestamp = getStepTimestamp(step.key);

                return (
                  <div
                    key={step.key}
                    className={`p-4 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
                        : isCurrent
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950 ring-2 ring-amber-400/40 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {isDone ? <Check size={14} strokeWidth={3} /> : step.stepNum}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Step {step.stepNum}
                      </span>
                    </div>

                    <p className={`text-xs font-black ${isDone || isCurrent ? 'text-slate-900' : 'text-stone-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{step.sub}</p>

                    {timestamp && (
                      <p className="text-[10px] font-mono text-emerald-700 mt-2 font-medium">
                        {timestamp}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Purchased Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery & Customer Info */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-soft space-y-4 text-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Delivery Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-500">Recipient Name:</span>
                  <span className="font-bold text-slate-800">{queriedOrder.customerName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-500">Phone Contact:</span>
                  <span className="font-mono font-bold text-slate-800">{queriedOrder.phone}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-500">Delivery Address:</span>
                  <span className="font-semibold text-slate-800 text-right max-w-xs">{queriedOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment Reference:</span>
                  <span className="font-mono font-bold text-emerald-800">{queriedOrder.mpesaRef || 'M-Pesa Verified'}</span>
                </div>
              </div>
            </div>

            {/* Package Contents */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-soft space-y-4 text-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Package Items ({queriedOrder.items?.length || 0})
              </h3>

              <div className="space-y-2">
                {queriedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 border-b border-stone-100 last:border-0">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {item.quantity}x {item.name || item.product_name_snapshot}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        Size: {item.size || item.size_label}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      KSh {((item.price || item.unit_price_snapshot || 0) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-stone-200">
                  <span>Order Total</span>
                  <span className="text-emerald-700">KSh {queriedOrder.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Support Helpline Card */}
          <div className="bg-emerald-950 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm">Have a question regarding this dispatch?</h4>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Contact the Aberdares customer desk via WhatsApp or phone.
              </p>
            </div>
            <a
              href="https://wa.me/254712792555"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs rounded-xl transition-colors whitespace-nowrap"
            >
              Contact Dispatch Desk &rarr;
            </a>
          </div>

        </div>
      ) : null}
    </div>
  );
};
