import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertCircle,
  Users,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Truck,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  Package
} from 'lucide-react';
import { products as fallbackProducts } from '../../data/products';
import { api } from '../../services/api';

export const DashboardPage = ({ setActiveTab, onViewOrder }) => {
  const [orders, setOrders] = useState([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [productCount, setProductCount] = useState(fallbackProducts.length);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [ordersData, custData, prodData] = await Promise.allSettled([
          api.getAdminOrders(),
          api.getAdminCustomers(),
          api.getProducts({ page_size: 100 })
        ]);

        if (ordersData.status === 'fulfilled' && Array.isArray(ordersData.value)) {
          setOrders(ordersData.value.map(o => ({
            id: o.order_number || o.id,
            customerName: o.customer_name || 'Customer',
            phone: o.customer_phone || '',
            statusCode: (o.status || 'pending').toLowerCase(),
            status: o.status || 'PENDING',
            total: o.total || 0,
            date: o.created_at ? new Date(o.created_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' }) : 'Recent',
            items: (o.items || []).map(it => ({
              name: it.product_name_snapshot || it.name,
              quantity: it.quantity
            }))
          })));
        } else {
          // Fallback to localStorage
          const saved = localStorage.getItem('aberdares_orders');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) setOrders(parsed);
          }
        }

        if (custData.status === 'fulfilled' && Array.isArray(custData.value)) {
          setCustomersCount(custData.value.length);
        }

        if (prodData.status === 'fulfilled') {
          const rawProds = prodData.value?.results || (Array.isArray(prodData.value) ? prodData.value : []);
          if (rawProds.length > 0) setProductCount(rawProds.length);
        }
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Compute live real metrics from orders
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(
    o => o.statusCode === 'processing' || o.statusCode === 'pending'
  ).length;

  const activeCustomersCount = customersCount || (new Set(orders.map(o => o.phone || o.customerName)).size);

  const stats = [
    {
      title: 'Gross Revenue',
      value: `KSh ${totalRevenue.toLocaleString()}`,
      sub: totalOrdersCount > 0 ? `${totalOrdersCount} order(s) placed` : 'No transactions yet',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Orders Processed',
      value: `${totalOrdersCount}`,
      sub: totalOrdersCount > 0 ? 'Live store checkouts' : 'Waiting for checkouts',
      icon: ShoppingBag,
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      title: 'Pending Fulfillment',
      value: `${pendingOrdersCount}`,
      sub: pendingOrdersCount > 0 ? 'Requires factory dispatch' : 'All orders cleared',
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Store Customers',
      value: `${activeCustomersCount}`,
      sub: activeCustomersCount > 0 ? 'Unique purchasing clients' : 'No customers yet',
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  // Compute top sold products from real orders
  const productSalesMap = {};
  orders.forEach(ord => {
    (ord.items || []).forEach(item => {
      const key = item.name || 'Unknown Item';
      if (!productSalesMap[key]) {
        productSalesMap[key] = {
          name: key,
          units: 0,
          rev: 0
        };
      }
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      productSalesMap[key].units += qty;
      productSalesMap[key].rev += qty * price;
    });
  });

  const sortedSales = Object.values(productSalesMap).sort((a, b) => b.units - a.units).slice(0, 5);
  const maxUnits = sortedSales.length > 0 ? Math.max(...sortedSales.map(s => s.units)) : 1;

  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (code) => {
    switch (code) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0f291e] to-[#1a4d36] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Sparkles size={13} />
            <span>Aberdares Operations Dashboard</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Factory & Online Dispatch Central
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
            Live operational monitoring for online store purchases, Ruiru production inventory, M-Pesa settlements, and parcel dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2 z-10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <ShoppingBag size={14} />
            <span>Manage Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
          >
            <span>Product Catalog</span>
          </button>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-soft hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 tracking-wide uppercase">
                  {stat.title}
                </span>
                <span className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon size={18} />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </span>
                <p className="text-xs text-stone-400 mt-1">
                  {stat.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/90 shadow-soft p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Live Dispatch & Recent Orders
              </h3>
              <p className="text-xs text-stone-500">
                Customer purchases placed on the online store
              </p>
            </div>
            {orders.length > 0 && (
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View All ({orders.length})</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                  <ShoppingBag size={22} />
                </div>
                <p className="text-xs font-bold text-slate-700">No Orders Received Yet</p>
                <p className="text-[11px] text-stone-400 max-w-sm mx-auto">
                  When customers complete checkout via M-Pesa or Cash on Delivery, their live orders and dispatch tracking will appear here.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5">Order ID</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5">Payment</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-800">
                        {ord.id}
                      </td>
                      <td className="py-3">
                        <p className="font-bold text-slate-800">{ord.customerName}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{ord.phone}</p>
                      </td>
                      <td className="py-3 font-extrabold text-slate-900">
                        KSh {(ord.total || 0).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className="text-[11px] font-medium text-stone-600 block">
                          {ord.paymentMethod?.split('(')[0] || 'M-Pesa'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(ord.statusCode)}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            if (onViewOrder) onViewOrder(ord);
                            else setActiveTab('orders');
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Product Performers (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200/90 shadow-soft p-5 sm:p-6 space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">
              Top Selling Formulas
            </h3>
            <p className="text-xs text-stone-500">
              Computed from customer checkouts
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {sortedSales.length === 0 ? (
              <div className="py-8 text-center space-y-1.5 text-stone-400">
                <Package size={28} className="mx-auto text-stone-300" />
                <p className="text-xs font-semibold text-stone-500">No Sales Recorded Yet</p>
                <p className="text-[11px]">Best-selling rankings will populate as orders are placed.</p>
              </div>
            ) : (
              sortedSales.map((item, idx) => {
                const pct = Math.round((item.units / maxUnits) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate max-w-[180px]">
                        {item.name}
                      </span>
                      <span className="font-extrabold text-emerald-800">
                        KSh {item.rev.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span>{item.units} unit(s) sold</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-stone-100 flex gap-2">
            <button
              onClick={() => setActiveTab('inventory')}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <span>Manage Inventory</span>
              <ChevronRight size={13} />
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <span>Catalog Details</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-soft flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">KEBS Standard Specifications</h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Production adheres to Kenya Bureau of Standards specifications for lather density, active matter, and pH balance.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-soft flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Delivery Logistics</h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Scheduled dispatches across Nairobi, Kiambu, and nationwide courier destinations.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-soft flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
            <Tag size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Promotions Engine</h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Configure promo vouchers, discount caps, and minimum order values via the Promo tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
