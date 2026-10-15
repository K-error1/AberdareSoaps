import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Users,
  Gift,
  Leaf,
  X,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

export const LoyaltyPage = () => {
  const [ledger, setLedger] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [adjustData, setAdjustData] = useState({
    customer: '',
    phone: '',
    points: 50,
    type: 'ADJUSTMENT',
    description: 'Manual customer reward'
  });

  const normalizeEntry = (e) => ({
    id: e.id,
    customer: e.customer_name || e.customer_email || 'Customer',
    email: e.customer_email || '',
    phone: e.phone || '',
    type: e.transaction_type || 'EARNED',
    points: e.points || 0,
    balanceAfter: e.balance_after || 0,
    date: e.created_at ? new Date(e.created_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
    description: e.description || 'Green points transaction'
  });

  const loadLedger = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminLoyaltyLedger();
      if (Array.isArray(data)) {
        setLedger(data.map(normalizeEntry));
      }
    } catch (err) {
      console.warn('API getAdminLoyaltyLedger fallback to localStorage:', err);
      try {
        const saved = localStorage.getItem('aberdares_loyalty_ledger');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setLedger(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  const saveLedger = (updated) => {
    setLedger(updated);
    try {
      localStorage.setItem('aberdares_loyalty_ledger', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdjust = (e) => {
    e.preventDefault();
    const pts = parseInt(adjustData.points) || 0;
    const currentCustBalance = ledger
      .filter(l => l.customer === adjustData.customer)
      .reduce((sum, l) => sum + l.points, 0);

    const newEntry = {
      id: `LOY-${Date.now()}`,
      customer: adjustData.customer,
      phone: adjustData.phone || '+254',
      type: adjustData.type,
      points: pts,
      balanceAfter: currentCustBalance + pts,
      orderId: 'Manual',
      date: 'Just now',
      description: adjustData.description
    };
    saveLedger([newEntry, ...ledger]);
    setIsModalOpen(false);
  };

  const filteredLedger = ledger.filter(
    item => filterType === 'all' || item.type === filterType
  );

  // Compute live metrics
  const totalPointsIssued = ledger
    .filter(l => l.points > 0)
    .reduce((sum, l) => sum + l.points, 0);

  const totalPointsRedeemed = Math.abs(
    ledger.filter(l => l.points < 0).reduce((sum, l) => sum + l.points, 0)
  );

  const activeLiability = Math.max(0, totalPointsIssued - totalPointsRedeemed);

  const uniqueMembers = new Set(ledger.map(l => l.customer)).size;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Green Points Loyalty Ledger
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Customer reward system (1 Point per KSh 50 spent, redeemable at checkout)
          </p>
        </div>

        <button
          onClick={() => {
            setAdjustData({
              customer: '',
              phone: '',
              points: 50,
              type: 'ADJUSTMENT',
              description: 'Customer loyalty bonus'
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Manual Point Award</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-soft">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Points Issued</span>
            <Award size={18} className="text-emerald-700" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalPointsIssued.toLocaleString()} pts</p>
          <span className="text-[11px] text-stone-400 font-semibold block mt-1">
            Issued from store checkouts
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-soft">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Points Redeemed</span>
            <Gift size={18} className="text-teal-700" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalPointsRedeemed.toLocaleString()} pts</p>
          <span className="text-[11px] text-stone-400 font-semibold mt-1 block">
            KSh {totalPointsRedeemed.toLocaleString()} shopper savings
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-soft">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Balance</span>
            <Leaf size={18} className="text-amber-700" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{activeLiability.toLocaleString()} pts</p>
          <span className="text-[11px] text-stone-400 font-semibold mt-1 block">
            Circulating member points
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-soft">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled Shoppers</span>
            <Users size={18} className="text-blue-700" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{uniqueMembers} Members</p>
          <span className="text-[11px] text-stone-400 font-semibold mt-1 block">
            Loyalty program participants
          </span>
        </div>
      </div>

      {/* Filter and Ledger Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-soft overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900">
            Live Points Ledger Activity
          </h3>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-stone-50 rounded-xl border border-stone-200 text-slate-700 self-start sm:self-auto"
          >
            <option value="all">All Events</option>
            <option value="EARNED">Earned from Purchase</option>
            <option value="REDEEMED">Redeemed on Order</option>
            <option value="ADJUSTMENT">Admin Adjustments</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Points Delta</th>
                <th className="py-2.5 px-3">New Balance</th>
                <th className="py-2.5 px-3">Order Ref</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <div className="space-y-1">
                      <Award size={28} className="mx-auto text-stone-300" />
                      <p className="font-bold text-slate-700 text-xs">No Loyalty Transactions Yet</p>
                      <p className="text-[11px] text-stone-400">
                        When customers checkout and earn Green Points, ledger entries will record here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {row.id}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">{row.customer}</p>
                      {row.phone && <p className="text-[10px] text-stone-400 font-mono">{row.phone}</p>}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        row.type === 'EARNED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : row.type === 'REDEEMED'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className={`py-3 px-3 font-black font-mono text-sm ${
                      row.points > 0 ? 'text-emerald-700' : 'text-teal-700'
                    }`}>
                      {row.points > 0 ? `+${row.points}` : row.points} pts
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {row.balanceAfter} pts
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {row.orderId}
                    </td>
                    <td className="py-3 px-3 text-stone-400 text-[11px] whitespace-nowrap">
                      {row.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Point Award Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Award Green Points</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdjust} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={adjustData.customer}
                  onChange={(e) => setAdjustData({ ...adjustData, customer: e.target.value })}
                  placeholder="e.g. Grace Wanjiku"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  value={adjustData.phone}
                  onChange={(e) => setAdjustData({ ...adjustData, phone: e.target.value })}
                  placeholder="+254 7..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Points Amount (+ or -) *</label>
                <input
                  type="number"
                  required
                  value={adjustData.points}
                  onChange={(e) => setAdjustData({ ...adjustData, points: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Reason / Description *</label>
                <input
                  type="text"
                  required
                  value={adjustData.description}
                  onChange={(e) => setAdjustData({ ...adjustData, description: e.target.value })}
                  placeholder="e.g. VIP Member Bonus"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
