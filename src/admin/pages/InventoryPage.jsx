import React, { useState, useEffect, useMemo } from 'react';
import {
  Boxes,
  Package,
  Plus,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  Eye,
  Store,
  Layers,
  ChevronDown,
  ChevronRight,
  Edit3,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../../services/api';
import { products as fallbackProducts, categories } from '../../data/products';

export const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'live', 'low', 'depleted'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [expandedProduct, setExpandedProduct] = useState(null);

  // Restock modal state
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [restockAmount, setRestockAmount] = useState(50);
  const [restockMode, setRestockMode] = useState('add'); // 'add' or 'set'
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState(null);

  // Add new inventory item modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: '',
    brand_line: 'Batian',
    category: 'bar-soaps',
    base_price: 150,
    stock_quantity: 100,
    default_size: '250g',
    short_description: 'Kenyan manufactured soap formulation.',
    eco_score: 'A+'
  });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const normalizeProduct = (p) => {
    const stockQty = Number(p.stockQuantity ?? p.stock_quantity ?? 0);
    const inStock = p.inStock !== undefined ? Boolean(p.inStock) : (p.in_stock !== undefined ? Boolean(p.in_stock) : stockQty > 0);
    return {
      id: p.id,
      slug: p.slug || p.id,
      name: p.name,
      brandLine: p.brandLine || p.brand_line || 'Batian',
      category: typeof p.category === 'object' ? p.category?.slug : (p.category || 'bar-soaps'),
      categoryName: p.category_name || (typeof p.category === 'object' ? p.category?.name : p.category),
      basePrice: Number(p.basePrice || p.base_price || 0),
      defaultSize: p.defaultSize || p.default_size || 'Standard',
      stockQuantity: stockQty,
      reservedQuantity: Number(p.reservedQuantity ?? p.reserved_quantity ?? 0),
      availableStock: Number(p.availableStock ?? p.available_stock ?? stockQty),
      inStock: inStock && stockQty > 0, // removed from sales if depleted
      isLiveOnSale: inStock && stockQty > 0,
      image: p.image || 'https://images.unsplash.com/photo-1607006311600-314b3b4d83ff?auto=format&fit=crop&w=400&q=80',
      ecoScore: p.ecoScore || p.eco_score || 'A+',
      sizes: Array.isArray(p.sizes) ? p.sizes : []
    };
  };

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      // Query with ?all=true so the API returns all products including depleted ones
      const data = await api.getProducts({ all: 'true' });
      const raw = data.results || (Array.isArray(data) ? data : []);
      if (raw.length > 0) {
        setProducts(raw.map(normalizeProduct));
      } else {
        setProducts(fallbackProducts.map(normalizeProduct));
      }
    } catch (err) {
      console.warn('Could not fetch from backend, loading fallback products:', err);
      setProducts(fallbackProducts.map(normalizeProduct));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Quick adjustment function
  const handleQuickAdjust = async (product, addUnits) => {
    setIsUpdating(true);
    try {
      const targetSlug = product.slug || product.id;
      const res = await api.adjustInventory(targetSlug, { add_stock: addUnits });
      const updated = normalizeProduct(res);

      setProducts(prev => prev.map(p => p.slug === targetSlug || p.id === targetSlug ? updated : p));

      if (updated.stockQuantity > 0) {
        showNotification(
          'success',
          `Restocked ${addUnits > 0 ? `+${addUnits}` : addUnits} units for "${product.name}". Product is now LIVE on the customer store!`
        );
      } else {
        showNotification(
          'warning',
          `Inventory for "${product.name}" depleted to 0. It is now automatically REMOVED from the customer store.`
        );
      }
    } catch (err) {
      showNotification('error', `Failed to adjust inventory: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Deplete to 0 (remove from sales)
  const handleDepleteToZero = async (product) => {
    if (!window.confirm(`Are you sure you want to mark "${product.name}" inventory as 0? This will immediately REMOVE it from the customer storefront sales catalog.`)) {
      return;
    }
    setIsUpdating(true);
    try {
      const targetSlug = product.slug || product.id;
      const res = await api.adjustInventory(targetSlug, { stock_quantity: 0 });
      const updated = normalizeProduct(res);

      setProducts(prev => prev.map(p => p.slug === targetSlug || p.id === targetSlug ? updated : p));
      showNotification(
        'warning',
        `"${product.name}" inventory has been depleted to 0 units. It is now REMOVED from sales products.`
      );
    } catch (err) {
      showNotification('error', `Depletion failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Submit Restock Modal
  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!activeProduct) return;
    setIsUpdating(true);

    try {
      const targetSlug = activeProduct.slug || activeProduct.id;
      const payload = restockMode === 'add'
        ? { add_stock: Number(restockAmount) }
        : { stock_quantity: Number(restockAmount) };

      const res = await api.adjustInventory(targetSlug, payload);
      const updated = normalizeProduct(res);

      setProducts(prev => prev.map(p => p.slug === targetSlug || p.id === targetSlug ? updated : p));
      setRestockModalOpen(false);

      if (updated.stockQuantity > 0) {
        showNotification(
          'success',
          `Inventory updated for "${activeProduct.name}" to ${updated.stockQuantity} units. Product is LIVE on customer storefront.`
        );
      } else {
        showNotification(
          'warning',
          `"${activeProduct.name}" set to 0 units. Automatically removed from sales.`
        );
      }
    } catch (err) {
      showNotification('error', `Update error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Add New Product directly to inventory
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const slug = newProductData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const payload = {
        name: newProductData.name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        brand_line: newProductData.brand_line,
        category: newProductData.category,
        base_price: Number(newProductData.base_price),
        stock_quantity: Number(newProductData.stock_quantity),
        default_size: newProductData.default_size,
        short_description: newProductData.short_description,
        full_description: newProductData.short_description,
        eco_score: newProductData.eco_score,
        in_stock: Number(newProductData.stock_quantity) > 0,
        is_active: true
      };

      const res = await api.createProduct(payload);
      const created = normalizeProduct(res);
      setProducts(prev => [created, ...prev]);
      setAddModalOpen(false);
      showNotification(
        'success',
        `Successfully registered "${created.name}" with ${created.stockQuantity} units. Now LIVE on store!`
      );
    } catch (err) {
      showNotification('error', `Failed to register product: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Derived metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const live = products.filter(p => p.isLiveOnSale).length;
    const low = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 15).length;
    const depleted = products.filter(p => !p.isLiveOnSale || p.stockQuantity <= 0).length;
    const totalUnits = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);

    return { total, live, low, depleted, totalUnits };
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Status filter
      if (statusFilter === 'live' && !p.isLiveOnSale) return false;
      if (statusFilter === 'low' && (p.stockQuantity <= 0 || p.stockQuantity > 15)) return false;
      if (statusFilter === 'depleted' && p.isLiveOnSale) return false;

      // Category filter
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

      // Brand filter
      if (brandFilter !== 'all' && p.brandLine.toLowerCase() !== brandFilter.toLowerCase()) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brandLine.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchSlug = p.slug.toLowerCase().includes(q);
        return matchName || matchBrand || matchCategory || matchSlug;
      }

      return true;
    });
  }, [products, statusFilter, categoryFilter, brandFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-medium transition-all transform animate-in slide-in-from-top-4 ${
            notification.type === 'success'
              ? 'bg-emerald-600 border border-emerald-400/50'
              : notification.type === 'warning'
              ? 'bg-amber-600 border border-amber-400/50'
              : 'bg-rose-600 border border-rose-400/50'
          }`}
        >
          {notification.type === 'success' && <CheckCircle2 size={20} className="shrink-0" />}
          {notification.type === 'warning' && <AlertTriangle size={20} className="shrink-0" />}
          {notification.type === 'error' && <XCircle size={20} className="shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0f291e] to-[#1a4d36] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-800/40">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Boxes size={14} />
            <span>Ruiru Manufacturing Plant & Warehouse</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Inventory & Storefront Stock Control
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-2xl">
            Live synchronization between Ruiru factory warehouse and customer e-commerce store. 
            Depleted inventory (<span className="text-rose-300 font-bold">0 units</span>) automatically disappears from customer sales. Restocked items immediately reappear on sale.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchInventory}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync Live Stock</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-black shadow-lg shadow-emerald-950/30 transition-all hover:scale-105"
          >
            <Plus size={16} />
            <span>Add Product to Inventory</span>
          </button>
        </div>
      </div>

      {/* Real-time KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Registered SKUs */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total SKUs</span>
            <Package size={18} className="text-emerald-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">{metrics.total}</span>
            <span className="text-xs text-stone-400">products</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Full factory product lines</p>
        </div>

        {/* Live on Storefront (Sales Products) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider">Live On Sale</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">{metrics.live}</span>
            <span className="text-xs text-emerald-600 font-semibold">Active in Shop</span>
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-1">Purchasable by customers</p>
        </div>

        {/* Low Stock Watch */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock (&le;15)</span>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{metrics.low}</span>
            <span className="text-xs text-amber-500 font-semibold">Need restock</span>
          </div>
          <p className="text-[11px] text-amber-700/80 mt-1">Risk of depletion soon</p>
        </div>

        {/* Depleted & Removed from Sale */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-bold uppercase tracking-wider">Depleted (Off Sale)</span>
            <XCircle size={18} className="text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">{metrics.depleted}</span>
            <span className="text-xs text-rose-500 font-semibold">Removed</span>
          </div>
          <p className="text-[11px] text-rose-600/80 mt-1">Hidden from public storefront</p>
        </div>

        {/* Total Warehouse Units */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Warehouse Units</span>
            <Boxes size={18} className="text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">{metrics.totalUnits.toLocaleString()}</span>
            <span className="text-xs text-stone-400">units</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Physical stock ready to ship</p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100/80 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All Items ({metrics.total})
            </button>
            <button
              onClick={() => setStatusFilter('live')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                statusFilter === 'live'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-500 hover:text-emerald-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
              Live On Sale ({metrics.live})
            </button>
            <button
              onClick={() => setStatusFilter('low')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                statusFilter === 'low'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-stone-500 hover:text-amber-700'
              }`}
            >
              <AlertTriangle size={12} />
              Low Stock ({metrics.low})
            </button>
            <button
              onClick={() => setStatusFilter('depleted')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                statusFilter === 'depleted'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-500 hover:text-rose-700'
              }`}
            >
              <XCircle size={12} />
              Depleted / Off Sale ({metrics.depleted})
            </button>
          </div>

          <div className="text-xs text-stone-400 font-medium">
            Showing <strong className="text-stone-800">{filteredProducts.length}</strong> matching products
          </div>
        </div>

        {/* Search & Category / Brand selects */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU, brand line or category..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white text-stone-700"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white text-stone-700"
            >
              <option value="all">All Brand Lines</option>
              <option value="Batian">Batian™ (Flagship & Laundry)</option>
              <option value="Lisa Lux">Lisa Lux™ (Personal & Beauty)</option>
              <option value="Elsie Suds">Elsie Suds™ (High-Foam Detergents)</option>
              <option value="Aberdares Pure">Aberdares Pure™ (Eco Hygiene)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm divide-y divide-stone-100">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Product & Brand</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Base Price</th>
                <th className="py-3.5 px-4">Warehouse Stock</th>
                <th className="py-3.5 px-4">Storefront Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Quick Restock / Deplete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw size={24} className="animate-spin text-emerald-600" />
                      <span>Loading real-time inventory from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center gap-2">
                      <Package size={32} className="text-stone-300" />
                      <p className="font-semibold text-stone-600">No inventory items matched your criteria.</p>
                      <button
                        onClick={() => { setStatusFilter('all'); setCategoryFilter('all'); setBrandFilter('all'); setSearchQuery(''); }}
                        className="text-xs text-emerald-600 font-bold hover:underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isDepleted = product.stockQuantity <= 0 || !product.isLiveOnSale;
                  const isLow = product.stockQuantity > 0 && product.stockQuantity <= 15;
                  const isHealthy = product.stockQuantity > 15;

                  // Percentage for health bar (cap at 150)
                  const percent = Math.min(100, Math.round((product.stockQuantity / 100) * 100));

                  return (
                    <React.Fragment key={product.id || product.slug}>
                      <tr className={`hover:bg-stone-50/80 transition-colors ${isDepleted ? 'bg-rose-50/20' : ''}`}>
                        {/* Product & SKU */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-11 h-11 rounded-xl object-cover border border-stone-200 bg-stone-100 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-stone-900 flex items-center gap-2">
                                <span>{product.name}</span>
                                {product.sizes.length > 0 && (
                                  <button
                                    onClick={() => setExpandedProduct(expandedProduct === product.slug ? null : product.slug)}
                                    className="p-1 rounded text-stone-400 hover:text-emerald-700 hover:bg-stone-100"
                                    title="View individual size stocks"
                                  >
                                    <ChevronDown
                                      size={14}
                                      className={`transition-transform ${expandedProduct === product.slug ? 'rotate-180' : ''}`}
                                    />
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                                <span className="font-semibold text-emerald-800">{product.brandLine}</span>
                                <span>•</span>
                                <span className="font-mono text-stone-500">SKU: {product.slug}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold capitalize">
                            {product.categoryName || product.category.replace(/-/g, ' ')}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-stone-900">
                            KSh {product.basePrice.toLocaleString()}
                          </span>
                        </td>

                        {/* Stock Level & Visual Bar */}
                        <td className="py-3.5 px-4 min-w-[160px]">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className={`font-black text-sm ${
                                isDepleted ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-emerald-800'
                              }`}>
                                {product.stockQuantity.toLocaleString()} units
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isDepleted
                                  ? 'bg-rose-100 text-rose-700'
                                  : isLow
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {isDepleted ? 'Depleted' : isLow ? 'Low Stock' : 'Healthy'}
                              </span>
                            </div>

                            {/* Mini Progress Bar */}
                            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isDepleted ? 'w-0' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Storefront Sales Status */}
                        <td className="py-3.5 px-4">
                          {product.isLiveOnSale ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>Live on Store</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                              <span>Removed from Store</span>
                            </span>
                          )}
                        </td>

                        {/* Quick Restock / Actions */}
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Quick +10 */}
                            <button
                              disabled={isUpdating}
                              onClick={() => handleQuickAdjust(product, 10)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all disabled:opacity-50"
                              title="Restock +10 units"
                            >
                              +10
                            </button>

                            {/* Quick +50 */}
                            <button
                              disabled={isUpdating}
                              onClick={() => handleQuickAdjust(product, 50)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all disabled:opacity-50"
                              title="Restock +50 units"
                            >
                              +50
                            </button>

                            {/* Custom Restock Modal Trigger */}
                            <button
                              onClick={() => {
                                setActiveProduct(product);
                                setRestockAmount(50);
                                setRestockMode('add');
                                setRestockModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all"
                              title="Custom Restock or Set Exact Stock"
                            >
                              Adjust...
                            </button>

                            {/* 1-click Deplete to 0 (Remove from sales) */}
                            {product.stockQuantity > 0 && (
                              <button
                                disabled={isUpdating}
                                onClick={() => handleDepleteToZero(product)}
                                className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs transition-all disabled:opacity-50"
                                title="Deplete to 0 (Remove from store immediately)"
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Size Breakdown Drawer */}
                      {expandedProduct === product.slug && product.sizes.length > 0 && (
                        <tr className="bg-stone-50/50">
                          <td colSpan={6} className="p-4 sm:px-8 border-b border-stone-100">
                            <div className="bg-white rounded-xl p-4 border border-stone-200 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                                  <Layers size={14} className="text-emerald-700" />
                                  <span>Packaging & Size Level Inventory ({product.name})</span>
                                </h4>
                                <span className="text-[11px] text-stone-400">
                                  Managed through main inventory pool
                                </span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {product.sizes.map((sz, i) => (
                                  <div key={i} className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex flex-col justify-between">
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="font-bold text-stone-800">{sz.label}</span>
                                      <span className="text-emerald-700 font-bold">KSh {sz.price}</span>
                                    </div>
                                    <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{sz.segment || 'Retail size'}</p>
                                    <div className="mt-2 text-[11px] flex justify-between items-center">
                                      <span className="text-stone-500">Size Stock:</span>
                                      <span className="font-bold text-emerald-800">{sz.stockQuantity ?? product.stockQuantity}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock & Stock Adjustment Modal */}
      {restockModalOpen && activeProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-in zoom-in-95 border border-stone-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                  Warehouse Stock Adjustment
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1">
                  {activeProduct.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Current physical stock: <strong className="text-stone-800">{activeProduct.stockQuantity} units</strong>
                </p>
              </div>
              <button
                onClick={() => setRestockModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              {/* Restock Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRestockMode('add')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    restockMode === 'add'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Add Units (+ Restock)
                </button>
                <button
                  type="button"
                  onClick={() => setRestockMode('set')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    restockMode === 'set'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Set Exact Count
                </button>
              </div>

              {/* Units Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  {restockMode === 'add' ? 'Units to Add to Inventory' : 'New Exact Inventory Count'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-base font-bold text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              {/* Quick Presets for adding */}
              {restockMode === 'add' && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-400 font-semibold">Presets:</span>
                  {[25, 50, 100, 250, 500].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setRestockAmount(qty)}
                      className="px-2 py-1 rounded bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-600 text-[11px] font-bold"
                    >
                      +{qty}
                    </button>
                  ))}
                </div>
              )}

              {/* Predicted Result Box */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Projected new stock:</span>
                  <strong className="text-stone-900 font-black">
                    {restockMode === 'add'
                      ? activeProduct.stockQuantity + Number(restockAmount || 0)
                      : Number(restockAmount || 0)}{' '}
                    units
                  </strong>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                  <span className="text-stone-500">Storefront Sales Status:</span>
                  {(restockMode === 'add' ? activeProduct.stockQuantity + Number(restockAmount) : Number(restockAmount)) > 0 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Live On Sale
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <XCircle size={12} /> Removed from Store
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Apply Stock Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product directly to Inventory Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                  Plant Operations & Catalog
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1">
                  Add New Product to Inventory
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  New products registered with stock &gt; 0 will automatically go live on the customer sales page.
                </p>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Batian Lemon Grass Sanitizing Bar"
                  value={newProductData.name}
                  onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Brand Line</label>
                  <select
                    value={newProductData.brand_line}
                    onChange={(e) => setNewProductData({ ...newProductData, brand_line: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Batian">Batian™</option>
                    <option value="Lisa Lux">Lisa Lux™</option>
                    <option value="Elsie Suds">Elsie Suds™</option>
                    <option value="Aberdares Pure">Aberdares Pure™</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Category</label>
                  <select
                    value={newProductData.category}
                    onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Initial Stock (Units) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProductData.stock_quantity}
                    onChange={(e) => setNewProductData({ ...newProductData, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-600 focus:bg-white text-emerald-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Base Price (KSh) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProductData.base_price}
                    onChange={(e) => setNewProductData({ ...newProductData, base_price: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-600 focus:bg-white text-stone-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Default Size</label>
                  <input
                    type="text"
                    value={newProductData.default_size}
                    onChange={(e) => setNewProductData({ ...newProductData, default_size: e.target.value })}
                    placeholder="250g / 5L"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Short Description</label>
                <textarea
                  rows={2}
                  value={newProductData.short_description}
                  onChange={(e) => setNewProductData({ ...newProductData, short_description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <Info size={16} className="shrink-0 mt-0.5 text-emerald-700" />
                <span>
                  Adding this product with <strong>{newProductData.stock_quantity} units</strong> will automatically publish it to the customer store catalog. If stock is set to 0, it will be registered in inventory but kept off-sale.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isUpdating ? 'Registering...' : 'Register into Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
