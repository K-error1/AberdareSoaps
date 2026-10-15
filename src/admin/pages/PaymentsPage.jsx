import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Eye,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Code,
  X,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

export const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const normalizePayment = (p) => {
    const isMpesa = p.provider === 'MPESA';
    const isCard = p.provider === 'PAYSTACK';
    return {
      id: p.id,
      orderId: p.orderNumber || 'N/A',
      provider: isMpesa ? 'Safaricom M-Pesa Daraja' : (isCard ? 'Paystack' : 'Cash on Delivery'),
      method: isMpesa ? 'STK Push (C2B)' : (isCard ? 'Visa / Mastercard' : 'Doorstep Collection'),
      phone: p.customerPhone || 'N/A',
      amount: Number(p.amount) || 0,
      status: p.status || 'PENDING',
      mpesaReceipt: p.mpesaReceipt || 'N/A',
      checkoutRequestId: p.checkoutRequestId || `ws_CO_${p.id?.slice(0, 8)}`,
      timestamp: p.date || 'Recent',
      rawPayload: p.rawPayload || {
        provider: p.provider,
        amount: p.amount,
        status: p.status,
        mpesaReceipt: p.mpesaReceipt
      }
    };
  };

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminPayments();
      if (Array.isArray(data)) {
        setPayments(data.map(normalizePayment));
      }
    } catch (err) {
      console.warn('API getAdminPayments fallback to localStorage:', err);
      try {
        const savedLogs = localStorage.getItem('aberdares_payment_logs');
        if (savedLogs) {
          const parsed = JSON.parse(savedLogs);
          if (Array.isArray(parsed)) setPayments(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const [selectedPayload, setSelectedPayload] = useState(null);
  const [filterProvider, setFilterProvider] = useState('all');

  const filteredPayments = payments.filter(
    p => filterProvider === 'all' || p.provider.toLowerCase().includes(filterProvider.toLowerCase())
  );

  // Compute live metrics
  const mpesaVolume = payments
    .filter(p => p.provider.toLowerCase().includes('m-pesa') && p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const cardVolume = payments
    .filter(p => p.provider.toLowerCase().includes('paystack') && p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payments.filter(p => p.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            M-Pesa Daraja & Card Settlements
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Real-time webhook events from Safaricom Paybill (174379) and Paystack gateway
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>M-Pesa Daraja Webhook: Active</span>
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            M-Pesa Settled Volume
          </span>
          <p className="text-2xl font-black text-slate-900 mt-2">KSh {mpesaVolume.toLocaleString()}</p>
          <span className="text-[11px] text-stone-400 font-semibold block mt-1">
            Settled via STK Push
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Card Settlements (Paystack)
          </span>
          <p className="text-2xl font-black text-slate-900 mt-2">KSh {cardVolume.toLocaleString()}</p>
          <span className="text-[11px] text-stone-400 font-semibold block mt-1">
            Visa / Mastercard transactions
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Pending Collections
          </span>
          <p className="text-2xl font-black text-amber-600 mt-2">{pendingCount} Transaction(s)</p>
          <span className="text-[11px] text-stone-400 block mt-1">
            Cash or delivery collections
          </span>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-soft overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900">
            Live Settlement Logs
          </h3>

          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-stone-50 rounded-xl border border-stone-200 text-slate-700"
          >
            <option value="all">All Gateways</option>
            <option value="daraja">Safaricom M-Pesa</option>
            <option value="paystack">Paystack Card</option>
            <option value="cash">Cash on Delivery</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Payment ID</th>
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Gateway & Channel</th>
                <th className="py-2.5 px-3">Customer Phone</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Receipt / Ref</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400">
                    <div className="space-y-1">
                      <CreditCard size={28} className="mx-auto text-stone-300" />
                      <p className="font-bold text-slate-700 text-xs">No Payment Transactions Recorded</p>
                      <p className="text-[11px] text-stone-400">
                        When orders are paid on the store, payment verification logs and M-Pesa receipts will display here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {p.id}
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-800 font-semibold">
                      {p.orderId}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">{p.provider}</p>
                      <p className="text-[10px] text-stone-400">{p.method}</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {p.phone ? `+${p.phone}` : '—'}
                    </td>
                    <td className="py-3 px-3 font-black text-slate-900 font-mono whitespace-nowrap">
                      KSh {p.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {p.mpesaReceipt}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-stone-400 text-[11px] whitespace-nowrap">
                      {p.timestamp}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedPayload(p)}
                        className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition-colors inline-flex items-center gap-1"
                        title="Inspect Webhook JSON"
                      >
                        <Code size={13} />
                        <span className="text-[11px] font-semibold">JSON</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Inspection Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 font-mono">
                  {selectedPayload.id} — Webhook Transaction Payload
                </h3>
                <p className="text-xs text-stone-400">
                  {selectedPayload.provider} • Order {selectedPayload.orderId}
                </p>
              </div>
              <button onClick={() => setSelectedPayload(null)} className="text-stone-400">
                <X size={20} />
              </button>
            </div>

            <pre className="p-4 bg-stone-900 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto max-h-80">
              {JSON.stringify(selectedPayload.rawPayload, null, 2)}
            </pre>

            <div className="flex justify-end pt-2 border-t border-stone-100">
              <button
                onClick={() => setSelectedPayload(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl"
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
