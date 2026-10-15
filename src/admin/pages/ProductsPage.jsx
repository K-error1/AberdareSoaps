import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Leaf,
  Layers,
  X,
  RefreshCw
} from 'lucide-react';
import { products as fallbackProducts, categories } from '../../data/products';
import { api } from '../../services/api';

export const ProductsPage = () => {
  const [productList, setProductList] = useState(fallbackProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const normalizeProduct = (p) => ({
    id: p.slug || p.id,
    slug: p.slug,
    rawId: p.id,
    name: p.name,
    brandLine: p.brandLine || p.brand_line || 'Batian',
    category: typeof p.category === 'object' ? p.category?.slug : (p.category || 'bar-soaps'),
    badge: p.badge || '',
    isFlagship: p.isFlagship !== undefined ? p.isFlagship : (p.is_flagship || false),
    basePrice: p.basePrice || p.base_price || 0,
    defaultSize: p.defaultSize || p.default_size || 'Standard',
    shortDescription: p.shortDescription || p.short_description || '',
    fullDescription: p.fullDescription || p.full_description || '',
    ingredients: p.ingredients || '',
    ecoScore: p.ecoScore || p.eco_score || 'A+',
    inStock: p.inStock !== undefined ? p.inStock : (p.in_stock !== false),
    image: p.image || '',
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    benefits: Array.isArray(p.benefits) ? p.benefits : []
  });

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProducts({ all: 'true', page_size: 100 });
      const raw = data.results || (Array.isArray(data) ? data : []);
      if (raw.length > 0) {
        setProductList(raw.map(normalizeProduct));
      }
    } catch (err) {
      console.warn('Failed to fetch products from API, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    brandLine: 'Batian',
    category: 'bar-soaps',
    badge: '',
    isFlagship: false,
    basePrice: '',
    defaultSize: '',
    shortDescription: '',
    fullDescription: '',
    ingredients: '',
    ecoScore: 'A+',
    inStock: true,
    image: '',
    sizes: [],
    benefits: []
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      id: `aberdare-${Date.now()}`,
      name: '',
      brandLine: 'Batian',
      category: 'bar-soaps',
      badge: '',
      isFlagship: false,
      basePrice: '',
      defaultSize: '',
      shortDescription: '',
      fullDescription: '',
      ingredients: '',
      ecoScore: 'A+',
      inStock: true,
      image: '',
      sizes: [],
      benefits: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      id: prod.id,
      name: prod.name,
      brandLine: prod.brandLine,
      category: prod.category,
      badge: prod.badge || '',
      isFlagship: prod.isFlagship || false,
      basePrice: prod.basePrice,
      defaultSize: prod.defaultSize,
      shortDescription: prod.shortDescription,
      fullDescription: prod.fullDescription,
      ingredients: prod.ingredients || '',
      ecoScore: prod.ecoScore || 'A',
      inStock: prod.inStock ?? true,
      image: prod.image,
      sizes: prod.sizes ? [...prod.sizes] : [{ label: prod.defaultSize, price: prod.basePrice, segment: 'Standard' }],
      benefits: prod.benefits ? [...prod.benefits] : []
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      brand_line: formData.brandLine,
      category_slug: formData.category,
      badge: formData.badge,
      is_flagship: formData.isFlagship,
      base_price: Number(formData.basePrice) || 0,
      default_size: formData.defaultSize || 'Standard',
      short_description: formData.shortDescription,
      full_description: formData.fullDescription,
      ingredients: formData.ingredients,
      eco_score: formData.ecoScore,
      in_stock: formData.inStock,
      image: formData.image,
      sizes: formData.sizes,
      benefits: formData.benefits
    };

    if (editingProduct) {
      try {
        await api.updateProduct(editingProduct.slug || editingProduct.id, payload);
      } catch (err) {
        console.warn('Backend updateProduct failed, saved locally:', err);
      }
      setProductList(prev => prev.map(p => p.id === editingProduct.id ? { ...formData } : p));
    } else {
      try {
        const created = await api.createProduct(payload);
        setProductList(prev => [normalizeProduct(created), ...prev]);
      } catch (err) {
        console.warn('Backend createProduct failed, saved locally:', err);
        setProductList(prev => [formData, ...prev]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to remove this product from the live catalog?')) {
      const prod = productList.find(p => p.id === id);
      if (prod) {
        try {
          await api.deleteProduct(prod.slug || prod.id);
        } catch (err) {
          console.warn('Backend deleteProduct failed, removed locally:', err);
        }
      }
      setProductList(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleStock = async (id) => {
    const prod = productList.find(p => p.id === id);
    if (!prod) return;
    const nextStock = !prod.inStock;

    try {
      await api.updateProduct(prod.slug || prod.id, { in_stock: nextStock });
    } catch (err) {
      console.warn('Backend update stock failed, updated locally:', err);
    }

    setProductList(prev =>
      prev.map(p => (p.id === id ? { ...p, inStock: nextStock } : p))
    );
  };

  const filteredProducts = productList.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brandLine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.shortDescription && prod.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || prod.category === selectedCategory;

    const matchesBrand =
      selectedBrand === 'all' || prod.brandLine === selectedBrand;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Products & Formula Inventory
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Active formulations manufactured at the Ruiru facility across our 4 flagship lines
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Formula</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, brand, keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-stone-400" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-slate-700"
          >
            <option value="all">All Categories ({productList.length})</option>
            {categories.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Brand Line Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-slate-700"
          >
            <option value="all">All Brand Lines</option>
            <option value="Batian">Batian™ Series</option>
            <option value="Lisa Lux">Lisa Lux™ Skincare</option>
            <option value="Elsie Suds">Elsie Suds™ Clean</option>
            <option value="Aberdares Pure">Aberdares Pure™</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Formula & SKU</th>
                <th className="py-3 px-4">Brand Line</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Sizes Range</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Eco Rating</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 truncate max-w-[200px]">
                            {prod.name}
                          </p>
                          {prod.isFlagship && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                              Flagship
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-400 font-mono">
                          ID: {prod.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {prod.brandLine}
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 capitalize">
                    {prod.category?.replace('-', ' ')}
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {prod.sizes?.length > 1 ? (
                      <span className="font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded-md">
                        {prod.sizes[0].label} – {prod.sizes[prod.sizes.length - 1].label} ({prod.sizes.length})
                      </span>
                    ) : (
                      <span className="font-mono text-[11px]">{prod.defaultSize}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                    KSh {prod.basePrice?.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      <Leaf size={10} />
                      {prod.ecoScore || 'A'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleStock(prod.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        prod.inStock
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {prod.inStock ? 'In Stock (Live)' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Edit Formula"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                {editingProduct ? 'Edit Formula Details' : 'Add New Formulation to Catalog'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Batian Multipurpose Bar"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Brand Line *</label>
                  <select
                    value={formData.brandLine}
                    onChange={(e) => setFormData({ ...formData, brandLine: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  >
                    <option value="Batian">Batian™</option>
                    <option value="Lisa Lux">Lisa Lux™</option>
                    <option value="Elsie Suds">Elsie Suds™</option>
                    <option value="Aberdares Pure">Aberdares Pure™</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Base Price (KSh) *</label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Eco-Score</label>
                  <select
                    value={formData.ecoScore}
                    onChange={(e) => setFormData({ ...formData, ecoScore: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  >
                    <option value="A++">A++ (100% Organic Highland)</option>
                    <option value="A+">A+ (Eco-Enzyme / Biodegradable)</option>
                    <option value="A">A (Standard Green)</option>
                    <option value="B+">B+ (Disinfectant Stabilized)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Short Summary</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Key highlight for product cards..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Botanical Ingredients</label>
                <input
                  type="text"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Available In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFlagship}
                    onChange={(e) => setFormData({ ...formData, isFlagship: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Mark as Flagship Bestseller</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all"
                >
                  {editingProduct ? 'Update Product' : 'Create Formula'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
