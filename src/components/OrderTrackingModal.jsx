import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  ShieldCheck,
  AlertCircle,
  Loader2,
  RefreshCw,
  Phone,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const FULFILLMENT_STEPS = [
  { key: 'RECEIVED', label: 'Order Received', sub: 'Ruiru Factory Desk', stepNum: 1 },
  { key: 'PACKAGED', label: 'Packaging & Sealed', sub: 'Kimbo Facility', stepNum: 2 },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', sub: 'Local Van / Courier', stepNum: 3 },
  { key: 'DELIVERED', label: 'Delivered', sub: 'Recipient Signed', stepNum: 4 }
];

export const OrderTrackingModal = ({ initialOrderId = '' }) => {
  const { isTrackingOpen, setIsTrackingOpen, lookupOrder, orders } = useCart();
  const [searchId, setSearchId] = useState('');
  const [queriedOrder, setQueriedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill and search when modal opens
  useEffect(() => {
    if (isTrackingOpen) {
      const defaultId = initialOrderId || orders[0]?.id || 'ABS-9169';
      setSearchId(defaultId);
      performSearch(defaultId);
    }
  }, [isTrackingOpen, initialOrderId]);

  if (!isTrackingOpen) return null;

  const performSearch = async (queryId) => {
    const cleanId = (queryId || searchId || '').trim().toUpperCase();
    if (!cleanId) {
      setErrorMsg('Please enter an Order ID.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Live Backend Lookup
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
      console.warn('Backend order lookup failed, checking local cart context:', err);
    }

    // 2. Local context / storage fallback
    const localFound = lookupOrder(cleanId);
    if (localFound) {
      setQueriedOrder({
        ...localFound,
        statusCode: (localFound.status || localFound.statusCode || 'pending').toLowerCase()
      });
      setIsLoading(false);
      return;
    }

    // 3. Not found
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
    return 0; // PENDING or others
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
    if (s === 'RECEIVED' || s === 'PROCESSING') return 'Packaging in Progress';
    return 'Pending Warehouse Confirmation';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-fadeIn flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Truck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">Aberdares Live Order Tracking</h2>
              <p className="text-xs text-stone-400">Real-time dispatch from Ruiru, Kimbo &ndash; Matangi Road</p>
            </div>
          </div>
          <button 
            onClick={() => setIsTrackingOpen(false)}
            className="text-stone-400 hover:text-white p-1.5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-5 sm:p-6 border-b border-stone-100 bg-stone-50 flex-shrink-0">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. ABS-9169)..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search size={16} className="absolute left-3 top-3 text-stone-400" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-aberdares-forest hover:bg-aberdares-deep text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              <span>Track</span>
            </button>
          </form>

          {errorMsg && (
            <div className="mt-2.5 text-xs text-rose-600 flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Order Progress Details */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-stone-400 space-y-3">
              <Loader2 size={32} className="animate-spin text-emerald-600" />
              <p className="text-xs font-medium">Fetching real-time dispatch status from Ruiru facility...</p>
            </div>
          ) : queriedOrder ? (
            <div className="space-y-6">
              
              {/* Status Header Pill */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    Current Fulfillment Status
                  </span>
                  <h4 className="text-base font-black text-slate-900 mt-0.5">
                    {formatStatusDisplay(queriedOrder.status)}
                  </h4>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-stone-500 block">Estimated Delivery</span>
                  <span className="text-xs font-black text-emerald-900">
                    {getEstimatedDeliveryText(queriedOrder.status)}
                  </span>
                </div>
              </div>

              {/* 4-Step Fulfillment Timeline (Formulation & QC step removed) */}
              <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-3 before:w-0.5 before:bg-stone-200">
                {FULFILLMENT_STEPS.map((step) => {
                  const currentIdx = getStepProgressIndex(queriedOrder.status);
                  const isDone = currentIdx >= step.stepNum;
                  const isCurrent = currentIdx === step.stepNum - 1 && queriedOrder.statusCode !== 'cancelled';
                  const timestamp = getStepTimestamp(step.key);

                  return (
                    <div key={step.key} className="relative flex items-start gap-3.5">
                      <div className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                        isDone 
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-100' 
                          : isCurrent
                          ? 'bg-amber-500 text-white shadow-sm ring-4 ring-amber-200 animate-pulse'
                          : 'bg-stone-100 text-stone-400 border border-stone-300'
                      }`}>
                        {isDone ? <Check size={13} strokeWidth={3} /> : step.stepNum}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className={`text-xs font-black ${isDone || isCurrent ? 'text-slate-900' : 'text-stone-400'}`}>
                            {step.label}
                          </h5>
                          {timestamp && (
                            <span className="text-[10px] font-mono text-stone-400">
                              {timestamp}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {step.sub}
                          {isCurrent && <span className="ml-1.5 font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded text-[10px]">In Progress</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Metadata Card */}
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
                <div className="space-y-1.5 bg-stone-50/50 rounded-2xl p-3 border border-stone-100">
                  {queriedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                      <span className="text-slate-700">
                        {item.quantity}x {item.name || item.product_name_snapshot} ({item.size || item.size_label})
                      </span>
                      <span className="font-bold text-slate-900">
                        KSh {((item.price || item.unit_price_snapshot || 0) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs pt-2 font-black text-slate-900 border-t border-stone-200">
                    <span>Total Paid</span>
                    <span className="text-emerald-700">KSh {queriedOrder.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Customer Support Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-amber-800" />
                  <span className="text-amber-950 font-medium">Need delivery assistance?</span>
                </div>
                <a
                  href="https://wa.me/254712792555"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-900 hover:underline"
                >
                  WhatsApp Dispatch &rarr;
                </a>
              </div>

            </div>
          ) : (
            <div className="py-8 text-center text-stone-400 space-y-2">
              <Package size={36} className="mx-auto text-stone-300" />
              <p className="text-xs">Enter your Aberdares order number above to view real-time live dispatch.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
