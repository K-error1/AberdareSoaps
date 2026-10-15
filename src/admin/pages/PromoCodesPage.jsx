import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Copy,
  Calendar,
  Percent,
  Truck,
  Trash2,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

const defaultFallbackPromos = [
  {
    id: 'PROMO-1',
    code: 'KARIBU10',
    type: 'PERCENTAGE',
    value: 10,
    freeDelivery: false,
    minOrderAmount: 0,
    maxUses: 500,
    usedCount: 0,
    description: '10% Welcome Discount for first-time shoppers',
    startsAt: '2026-01-01',
    expiresAt: '2026-12-31',
    isActive: true
  },
  {
    id: 'PROMO-2',
    code: 'ABERDARE',
    type: 'PERCENTAGE',
    value: 0,
    freeDelivery: true,
    minOrderAmount: 1500,
    maxUses: 1000,
    usedCount: 0,
    description: 'Free Nairobi & Kiambu Doorstep Delivery',
    startsAt: '2026-01-01',
    expiresAt: '2026-12-31',
    isActive: true
  },
  {
    id: 'PROMO-3',
    code: 'GREEN20',
    type: 'PERCENTAGE',
    value: 20,
    freeDelivery: false,
    minOrderAmount: 2500,
    maxUses: 200,
    usedCount: 0,
    description: '20% Eco-Hero Loyalty Discount',
    startsAt: '2026-01-01',
    expiresAt: '2026-12-31',
    isActive: true
  }
];

export const PromoCodesPage = () => {
  const [promos, setPromos] = useState(defaultFallbackPromos);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: 10,
    freeDelivery: false,
    minOrderAmount: 0,
    maxUses: 500,
    description: '',
    expiresAt: '2026-12-31',
    isActive: true
  });

  const normalizePromo = (p) => ({
    id: p.id,
    code: p.code,
    type: p.promo_type || p.type || 'PERCENTAGE',
    value: p.value || 0,
    freeDelivery: p.free_delivery !== undefined ? p.free_delivery : (p.freeDelivery || false),
    minOrderAmount: p.min_order_amount !== undefined ? p.min_order_amount : (p.minOrderAmount || 0),
    maxUses: p.max_uses !== undefined ? p.max_uses : (p.maxUses || 500),
    usedCount: p.used_count !== undefined ? p.used_count : (p.usedCount || 0),
    description: p.description || '',
    expiresAt: p.expires_at ? p.expires_at.split('T')[0] : (p.expiresAt || '2026-12-31'),
    isActive: p.is_active !== undefined ? p.is_active : (p.isActive !== false)
  });

  const loadPromos = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminPromoCodes();
      const raw = data.results || (Array.isArray(data) ? data : []);
      if (raw.length > 0) {
        setPromos(raw.map(normalizePromo));
      }
    } catch (err) {
      console.warn('API getAdminPromoCodes failed, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const toggleStatus = async (id) => {
    const promo = promos.find(p => p.id === id);
    if (!promo) return;
    const nextActive = !promo.isActive;

    try {
      await api.updatePromoCode(id, { is_active: nextActive });
    } catch (err) {
      console.warn('Backend updatePromoCode failed, updated locally:', err);
    }

    setPromos(prev =>
      prev.map(p => (p.id === id ? { ...p, isActive: nextActive } : p))
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this promotional discount voucher?')) {
      try {
        await api.deletePromoCode(id);
      } catch (err) {
        console.warn('Backend deletePromoCode failed, deleted locally:', err);
      }
      setPromos(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const cleanCode = formData.code.toUpperCase().trim();
    const payload = {
      code: cleanCode,
      promo_type: formData.type,
      value: Number(formData.value) || 0,
      free_delivery: Boolean(formData.freeDelivery),
      min_order_amount: Number(formData.minOrderAmount) || 0,
      max_uses: Number(formData.maxUses) || 500,
      description: formData.description,
      is_active: true
    };

    try {
      const created = await api.createPromoCode(payload);
      setPromos([normalizePromo(created), ...promos]);
    } catch (err) {
      console.warn('Backend createPromoCode failed, saved locally:', err);
      const newPromo = {
        id: `PROMO-${Date.now()}`,
        ...formData,
        code: cleanCode,
        usedCount: 0
      };
      setPromos([newPromo, ...promos]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Promotional Coupons & Campaigns
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Create discount vouchers, free delivery waivers, and corporate partner campaign codes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadPromos}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer"
            title="Refresh promo codes"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => {
              setFormData({
                code: '',
                type: 'PERCENTAGE',
                value: 15,
                freeDelivery: false,
                minOrderAmount: 1000,
                maxUses: 300,
                description: '',
                expiresAt: '2026-12-31',
                isActive: true
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Promo Code</span>
          </button>
        </div>
      </div>

      {/* Promo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs relative overflow-hidden flex flex-col justify-between transition-all ${
              promo.isActive ? 'border-stone-200 hover:shadow-md' : 'border-stone-200 opacity-60 bg-stone-50'
            }`}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                promo.type === 'PERCENTAGE' && promo.value > 0
                  ? 'bg-amber-100 text-amber-800'
                  : (promo.freeDelivery ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800')
              }`}>
                {promo.freeDelivery ? 'Free Delivery' : `${promo.value}% OFF`}
              </span>

              <button
                onClick={() => toggleStatus(promo.id)}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md cursor-pointer ${
                  promo.isActive ? 'text-emerald-700 bg-emerald-50' : 'text-stone-500 bg-stone-200'
                }`}
              >
                {promo.isActive ? 'Active' : 'Disabled'}
              </button>
            </div>

            {/* Code Box */}
            <div className="my-4 p-3 bg-stone-50 rounded-xl border border-dashed border-stone-300 flex items-center justify-between">
              <span className="font-mono text-base font-black tracking-wider text-slate-900">
                {promo.code}
              </span>
              <button
                onClick={() => handleCopy(promo.code)}
                className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-white rounded-lg transition-all cursor-pointer"
                title="Copy Code"
              >
                {copiedCode === promo.code ? (
                  <Check size={16} className="text-emerald-600" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            <p className="text-xs text-stone-600 line-clamp-2 mb-3">
              {promo.description || 'Promotional coupon code'}
            </p>

            {/* Stats */}
            <div className="space-y-1.5 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
              <div className="flex justify-between">
                <span>Usage count:</span>
                <span className="font-bold text-slate-800">{promo.usedCount} / {promo.maxUses}</span>
              </div>
              <div className="flex justify-between">
                <span>Min spend:</span>
                <span className="font-semibold text-slate-800">
                  {promo.minOrderAmount > 0 ? `KSh ${promo.minOrderAmount.toLocaleString()}` : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Expires:</span>
                <span className="font-semibold text-slate-800">{promo.expiresAt}</span>
              </div>
            </div>

            {/* Delete button */}
            <div className="pt-3 mt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => handleDelete(promo.id)}
                className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Promo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Create New Promo Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Promo Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono uppercase"
                  placeholder="e.g. MASHUJAA20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="PERCENTAGE">Percentage Discount (%)</option>
                    <option value="FIXED">Fixed Amount (KES)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Value ({formData.type === 'PERCENTAGE' ? '%' : 'KES'})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <input
                  type="checkbox"
                  id="freeDel"
                  checked={formData.freeDelivery}
                  onChange={(e) => setFormData({ ...formData, freeDelivery: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="freeDel" className="font-bold text-slate-700 cursor-pointer">
                  Includes 100% Free Doorstep Delivery
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Min. Order Subtotal (KES)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Max Redemptions</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Customer Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  placeholder="e.g. 15% discount for Ruiru neighborhood residents"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save Promo Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodesPage;
