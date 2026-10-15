import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Award,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const normalizeCustomer = (c) => ({
    id: c.id,
    name: c.name || c.email?.split('@')[0] || 'Customer',
    email: c.email || '',
    phone: c.phone || 'N/A',
    role: c.role || 'CUSTOMER',
    joined: c.joined || 'Recent',
    totalOrders: c.totalOrders || 0,
    totalSpend: c.totalSpend || 0,
    points: c.loyaltyPoints !== undefined ? c.loyaltyPoints : (c.points || 0),
    status: c.is_active !== false ? 'Active' : 'Suspended',
    is_active: c.is_active !== false,
    location: c.location || 'Nairobi, Kenya'
  });

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminCustomers();
      if (Array.isArray(data)) {
        setCustomers(data.map(normalizeCustomer));
      }
    } catch (err) {
      console.warn('API getAdminCustomers failed, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const toggleStatus = async (id) => {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;
    const nextActive = !cust.is_active;

    try {
      await api.updateCustomer(id, { is_active: nextActive });
    } catch (err) {
      console.warn('Backend updateCustomer failed, updated locally:', err);
    }

    setCustomers(prev =>
      prev.map(c =>
        c.id === id ? { ...c, is_active: nextActive, status: nextActive ? 'Active' : 'Suspended' } : c
      )
    );
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    const matchesRole = selectedRole === 'all' || c.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Customer Directory & Accounts
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Registered consumer shoppers, hotel procurement managers, and B2B partners
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-stone-500">
            Total Customers: <strong className="text-slate-900">{customers.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-stone-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-slate-700"
          >
            <option value="all">All Roles</option>
            <option value="CUSTOMER">Retail Consumer</option>
            <option value="B2B Wholesale">B2B Wholesale / Lodges</option>
            <option value="ADMIN">Staff / Administrator</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Green Points</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <div className="space-y-1">
                      <Users size={28} className="mx-auto text-stone-300" />
                      <p className="font-bold text-slate-700 text-xs">No Customer Records Yet</p>
                      <p className="text-[11px] text-stone-400">
                        Profiles will appear automatically as shoppers register or complete checkouts.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  className="hover:bg-stone-50/80 transition-colors cursor-pointer"
                  onClick={() => setSelectedCustomer(cust)}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{cust.name}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{cust.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      cust.role === 'ADMIN'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : cust.role === 'B2B Wholesale'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {cust.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {cust.location}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {cust.totalOrders} order(s)
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                    KSh {cust.totalSpend.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                      <Award size={12} />
                      {cust.points} pts
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      cust.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye size={12} />
                      <span>Profile</span>
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">
                    ID: {selectedCustomer.id} • Joined {selectedCustomer.joined}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-stone-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl space-y-0.5">
                <span className="text-[10px] text-stone-400 font-bold uppercase">Phone</span>
                <p className="font-mono font-bold text-slate-800">{selectedCustomer.phone}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl space-y-0.5">
                <span className="text-[10px] text-stone-400 font-bold uppercase">Email</span>
                <p className="font-medium text-slate-800 truncate">{selectedCustomer.email}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl space-y-0.5">
                <span className="text-[10px] text-stone-400 font-bold uppercase">Lifetime Spend</span>
                <p className="font-black text-emerald-800 text-sm">
                  KSh {selectedCustomer.totalSpend.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl space-y-0.5">
                <span className="text-[10px] text-stone-400 font-bold uppercase">Green Loyalty</span>
                <p className="font-black text-emerald-800 text-sm">
                  {selectedCustomer.points} pts
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-xs">
              <span className="text-[10px] text-stone-400 font-bold uppercase">Delivery Destination</span>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <MapPin size={13} className="text-stone-400" />
                {selectedCustomer.location}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
              <button
                onClick={() => toggleStatus(selectedCustomer.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  selectedCustomer.status === 'Active'
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {selectedCustomer.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
              </button>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
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
