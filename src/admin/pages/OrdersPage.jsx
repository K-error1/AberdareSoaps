import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Phone,
  MapPin,
  CreditCard,
  XCircle,
  RefreshCw,
  Clock,
  Package,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShieldCheck,
  Ban
} from 'lucide-react';
import { api } from '../../services/api';

const FULFILLMENT_STEPS = [
  { key: 'RECEIVED', label: 'Order Received', sub: 'Ruiru Factory Desk', stepNum: 1 },
  { key: 'PACKAGED', label: 'Packaged & Sealed', sub: 'Kimbo Facility', stepNum: 2 },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', sub: 'Local Van / Courier', stepNum: 3 },
  { key: 'DELIVERED', label: 'Delivered', sub: 'Recipient Signed', stepNum: 4 }
];

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customNote, setCustomNote] = useState('');

  const formatApiOrders = (rawList) => {
    return rawList.map((o) => {
      // Serializer aliases: id=order_number, uuid=UUID, customerName, phone, email,
      // deliveryAddress, paymentMethod, paymentStatus, mpesaRef.
      // Non-aliased (snake_case): status, subtotal, discount_amount, delivery_fee,
      // total, delivery_option, delivery_town, delivery_county, items, status_history, created_at.
      const rawMethod = o.paymentMethod || o.payment_method || 'MPESA';
      const paymentMethodLabel =
        rawMethod === 'MPESA' ? 'M-Pesa STK'
          : rawMethod === 'CARD' ? 'Card (Paystack)'
          : 'Cash on Delivery';

      return {
        id: o.id || o.order_number,
        uuid: o.uuid,
        customerName: o.customerName || o.customer_name || 'Guest Customer',
        phone: o.phone || o.customer_phone || '',
        email: o.email || o.customer_email || '',
        statusCode: (o.status || 'PENDING').toLowerCase(),
        status: (o.status || 'PENDING').toUpperCase(),
        paymentMethod: paymentMethodLabel,
        paymentStatus: o.paymentStatus || o.payment_status || 'PENDING',
        mpesaRef: o.mpesaRef || o.mpesa_receipt_number || '',
        deliveryOption: o.delivery_option || 'nairobi',
        deliveryAddress: [
          o.deliveryAddress || o.delivery_address,
          o.delivery_town,
          o.delivery_county,
        ].filter(Boolean).join(', ') || 'N/A',
        total: o.total || 0,
        subtotal: o.subtotal || 0,
        deliveryFee: o.delivery_fee || 0,
        discount: o.discount_amount || 0,
        date: o.created_at
          ? new Date(o.created_at).toLocaleDateString('en-KE', {
              month: 'short', day: 'numeric', year: 'numeric',
            })
          : 'Recent',
        items: (o.items || []).map((it) => ({
          name: it.name || it.product_name_snapshot || 'Product',
          size: it.size || it.size_label || 'Standard',
          price: it.price || it.unit_price_snapshot || 0,
          quantity: it.quantity || 1,
          total: it.line_total || 0,
        })),
        timeline: (o.status_history || []).map((h) => ({
          fromStatus: h.from_status,
          status: h.to_status,
          note: h.notes || '',
          date: h.created_at
            ? new Date(h.created_at).toLocaleString('en-KE', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
              })
            : '',
        })),
      };
    });
  };

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminOrders();
      setOrders(formatApiOrders(data));
    } catch (err) {
      console.error('Failed to fetch orders from backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStepProgressIndex = (statusStr) => {
    const s = (statusStr || '').toUpperCase();
    if (s === 'DELIVERED') return 4;
    if (s === 'OUT_FOR_DELIVERY') return 3;
    if (s === 'PACKAGED') return 2;
    if (s === 'RECEIVED' || s === 'PAID' || s === 'PROCESSING') return 1;
    return 0; // PENDING or others
  };

  const getNextStageConfig = (statusStr) => {
    const s = (statusStr || '').toUpperCase();
    if (s === 'PENDING' || s === 'PAID') {
      return {
        nextStatus: 'RECEIVED',
        label: 'Approve & Confirm Received',
        note: 'Order confirmed at Ruiru Factory Desk',
        icon: CheckCircle2,
        btnColor: 'bg-blue-600 hover:bg-blue-700 text-white'
      };
    }
    if (s === 'RECEIVED' || s === 'PROCESSING') {
      return {
        nextStatus: 'PACKAGED',
        label: 'Approve Packaged & Sealed',
        note: 'Inspected, packaged and sealed at Kimbo Facility',
        icon: Package,
        btnColor: 'bg-amber-600 hover:bg-amber-700 text-white'
      };
    }
    if (s === 'PACKAGED') {
      return {
        nextStatus: 'OUT_FOR_DELIVERY',
        label: 'Dispatch: Out for Delivery',
        note: 'Dispatched with local van / courier service',
        icon: Truck,
        btnColor: 'bg-purple-600 hover:bg-purple-700 text-white'
      };
    }
    if (s === 'OUT_FOR_DELIVERY') {
      return {
        nextStatus: 'DELIVERED',
        label: 'Confirm Customer Delivered',
        note: 'Order delivered to recipient and signed',
        icon: ShieldCheck,
        btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white'
      };
    }
    return null;
  };

  const handleUpdateStatus = async (orderId, newStatus, noteText = '') => {
    setIsUpdating(true);
    const finalNote = noteText || `Status updated to ${newStatus}`;
    try {
      await api.updateOrderStatus(orderId, newStatus.toUpperCase(), finalNote);
    } catch (err) {
      console.warn('Backend updateOrderStatus failed, updating local state:', err);
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedTimeline = [
            {
              fromStatus: o.status,
              status: newStatus.toUpperCase(),
              note: finalNote,
              date: new Date().toLocaleString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            },
            ...(o.timeline || [])
          ];
          return {
            ...o,
            statusCode: newStatus.toLowerCase(),
            status: newStatus.toUpperCase(),
            timeline: updatedTimeline
          };
        }
        return o;
      })
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({
        ...prev,
        statusCode: newStatus.toLowerCase(),
        status: newStatus.toUpperCase(),
        timeline: [
          {
            fromStatus: prev.status,
            status: newStatus.toUpperCase(),
            note: finalNote,
            date: new Date().toLocaleString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          },
          ...(prev.timeline || [])
        ]
      }));
    }

    setIsUpdating(false);
    setCustomNote('');
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      (order.mpesaRef && order.mpesaRef.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === 'all' || order.statusCode === selectedStatus;

    const matchesPayment =
      selectedPayment === 'all' ||
      (selectedPayment === 'mpesa' && order.paymentMethod?.toLowerCase().includes('m-pesa')) ||
      (selectedPayment === 'card' && order.paymentMethod?.toLowerCase().includes('card')) ||
      (selectedPayment === 'cod' && order.paymentMethod?.toLowerCase().includes('delivery'));

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (code) => {
    switch (code) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'packaged':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'received':
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'paid':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'pending':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'cancelled':
        return 'bg-stone-200 text-stone-700 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const formatStatusDisplay = (statusStr) => {
    const s = (statusStr || '').toUpperCase();
    if (s === 'RECEIVED' || s === 'PROCESSING') return 'Received';
    if (s === 'PACKAGED') return 'Packaged & Sealed';
    if (s === 'OUT_FOR_DELIVERY') return 'Out for Delivery';
    if (s === 'DELIVERED') return 'Delivered';
    if (s === 'PENDING') return 'Pending';
    if (s === 'PAID') return 'Paid';
    if (s === 'CANCELLED') return 'Cancelled';
    return statusStr;
  };

  return (
    <div className="space-y-6">
      {/* Title & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Order Fulfillment & Tracking</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              Live Pipeline
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Real-time step-by-step dispatch pipeline: Received &rarr; Packaged &rarr; Out for Delivery &rarr; Delivered
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadOrders}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <span className="text-xs font-bold text-stone-500 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
            Total Orders: <strong className="text-slate-900">{orders.length}</strong>
          </span>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, phone, M-Pesa ref..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-stone-400" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Payment</option>
            <option value="received">Order Received</option>
            <option value="packaged">Packaged & Sealed</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-slate-700"
          >
            <option value="all">All Payment Modes</option>
            <option value="mpesa">M-Pesa STK</option>
            <option value="card">Card (Paystack)</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4 text-right">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-stone-400">
                    No orders found matching filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const nextConfig = getNextStageConfig(ord.status);
                  const progressIdx = getStepProgressIndex(ord.status);

                  return (
                    <tr
                      key={ord.id}
                      className="hover:bg-stone-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(ord)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {ord.id}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 text-[11px] whitespace-nowrap">
                        {ord.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{ord.customerName}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{ord.phone}</p>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 max-w-[150px] truncate" title={ord.deliveryAddress}>
                        {ord.deliveryAddress}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {ord.items?.length || 1} item(s)
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                        KSh {ord.total?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="block font-semibold text-slate-700 text-[11px]">
                          {ord.paymentMethod?.split('(')[0] || 'M-Pesa'}
                        </span>
                        {ord.mpesaRef && (
                          <span className="font-mono text-[9px] text-stone-400 block">
                            {ord.mpesaRef}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 whitespace-nowrap ${getStatusBadge(ord.statusCode)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>{formatStatusDisplay(ord.status)}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {nextConfig && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, nextConfig.nextStatus, nextConfig.note)}
                              disabled={isUpdating}
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs ${nextConfig.btnColor}`}
                              title={nextConfig.label}
                            >
                              <nextConfig.icon size={12} />
                              <span className="hidden xl:inline">{nextConfig.label}</span>
                              <span className="xl:hidden">Approve</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <Eye size={12} />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Fulfillment Pipeline Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 my-8 max-h-[90vh] overflow-y-auto border border-stone-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 font-mono">
                    {selectedOrder.id}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedOrder.statusCode)}`}>
                    {formatStatusDisplay(selectedOrder.status)}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Placed on {selectedOrder.date} &bull; Destination: {selectedOrder.deliveryAddress}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-slate-800 hover:bg-stone-100 transition-colors"
              >
                <XCircle size={22} />
              </button>
            </div>

            {/* 4-Step Interactive Fulfillment Pipeline */}
            <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Fulfillment Approval Pipeline
                </span>
                <span className="text-[11px] font-medium text-stone-500">
                  {getStepProgressIndex(selectedOrder.status)} of 4 Steps Completed
                </span>
              </div>

              {/* Step Icons Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FULFILLMENT_STEPS.map((step, idx) => {
                  const currentIdx = getStepProgressIndex(selectedOrder.status);
                  const isDone = currentIdx >= step.stepNum;
                  const isCurrent = currentIdx === step.stepNum - 1 && selectedOrder.statusCode !== 'cancelled';

                  return (
                    <div
                      key={step.key}
                      className={`p-3 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                          : isCurrent
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950 ring-2 ring-amber-400/40'
                          : 'bg-white border-stone-200 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-amber-500 text-white animate-pulse'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={12} /> : step.stepNum}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Step {step.stepNum}
                        </span>
                      </div>
                      <p className={`text-xs font-extrabold ${isDone || isCurrent ? 'text-slate-900' : 'text-stone-400'}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-stone-500 truncate mt-0.5">{step.sub}</p>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar: Next Step Approval */}
              {(() => {
                const nextConfig = getNextStageConfig(selectedOrder.status);

                if (selectedOrder.statusCode === 'delivered') {
                  return (
                    <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-bold">
                      <CheckCircle2 size={16} className="text-emerald-700" />
                      <span>Order Fulfillment Complete &mdash; Customer has received the items.</span>
                    </div>
                  );
                }

                if (selectedOrder.statusCode === 'cancelled') {
                  return (
                    <div className="p-3 bg-stone-200 border border-stone-300 rounded-xl flex items-center gap-2 text-stone-700 text-xs font-bold">
                      <Ban size={16} />
                      <span>This order has been Cancelled.</span>
                    </div>
                  );
                }

                if (nextConfig) {
                  return (
                    <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
                            Next Required Approval
                          </span>
                          <span className="text-xs font-black text-slate-800">
                            Advance to {nextConfig.label}
                          </span>
                        </div>
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder.id, nextConfig.nextStatus, customNote || nextConfig.note)}
                          disabled={isUpdating}
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 justify-center ${nextConfig.btnColor}`}
                        >
                          <nextConfig.icon size={15} />
                          <span>{nextConfig.label}</span>
                        </button>
                      </div>

                      {/* Optional dispatch note input */}
                      <input
                        type="text"
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        placeholder={`Optional approval note (Default: "${nextConfig.note}")`}
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  );
                }

                return null;
              })()}

              {/* Manual Override Status Selector */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200/80 text-xs text-stone-500">
                <span>Manual Override Status:</span>
                <select
                  value={selectedOrder.statusCode}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value, `Admin manual override to ${e.target.value}`)}
                  className="px-2.5 py-1 text-xs font-bold bg-white text-slate-800 rounded-lg border border-stone-300 shadow-xs focus:outline-none"
                >
                  <option value="pending">Pending Payment</option>
                  <option value="received">1. Order Received</option>
                  <option value="packaged">2. Packaged & Sealed</option>
                  <option value="out_for_delivery">3. Out for Delivery</option>
                  <option value="delivered">4. Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Audit Trail Timeline */}
            {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Clock size={13} />
                  <span>Audit History & Approvals</span>
                </h4>
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 divide-y divide-stone-200/70 text-xs">
                  {selectedOrder.timeline.map((entry, i) => (
                    <div key={i} className="py-2 first:pt-0 last:pb-0 flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-800 mr-2">
                          {formatStatusDisplay(entry.status)}
                        </span>
                        <span className="text-stone-500 text-[11px] block sm:inline">
                          {entry.note}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400 whitespace-nowrap">
                        {entry.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                Purchased Soap & Detergent Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/50">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-[11px] text-stone-400">
                        Size: <span className="font-semibold text-slate-600">{item.size}</span> &times; {item.quantity} units
                      </p>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

                {/* Subtotals & Delivery */}
                <div className="p-4 bg-white space-y-1.5 text-xs border-t border-stone-200">
                  <div className="flex justify-between text-stone-500">
                    <span>Subtotal</span>
                    <span>KSh {selectedOrder.subtotal?.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo Discount</span>
                      <span>-KSh {selectedOrder.discount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-500">
                    <span>Delivery Fee</span>
                    <span>
                      {selectedOrder.deliveryFee === 0 ? 'FREE' : `KSh ${selectedOrder.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-stone-100">
                    <span>Total Amount</span>
                    <span className="text-emerald-700">
                      KSh {selectedOrder.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Delivery Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-stone-400 block">
                  Customer Details
                </span>
                <p className="font-bold text-slate-800 text-sm">{selectedOrder.customerName}</p>
                <p className="text-stone-600 flex items-center gap-1.5 font-mono">
                  <Phone size={13} className="text-stone-400" />
                  {selectedOrder.phone}
                </p>
                {selectedOrder.email && (
                  <p className="text-stone-500">{selectedOrder.email}</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-stone-400 block">
                  Delivery Destination
                </span>
                <p className="font-semibold text-slate-800">{selectedOrder.deliveryOption}</p>
                <p className="text-stone-600 flex items-start gap-1.5">
                  <MapPin size={13} className="text-stone-400 flex-shrink-0 mt-0.5" />
                  <span>{selectedOrder.deliveryAddress}</span>
                </p>
              </div>
            </div>

            {/* Payment & M-Pesa Info */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-stone-400 block">
                Payment Verification
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CreditCard size={15} className="text-emerald-700" />
                  <span className="font-bold text-slate-800">{selectedOrder.paymentMethod}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedOrder.paymentStatus === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                {selectedOrder.mpesaRef && (
                  <div className="font-mono text-xs bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                    Ref: <strong className="text-emerald-800">{selectedOrder.mpesaRef}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
