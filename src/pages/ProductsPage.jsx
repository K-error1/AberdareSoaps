import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Layers, 
  Maximize2, 
  Check, 
  Sparkles, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { products as fallbackProducts, categories } from '../data/products';
import { barSoapSizes } from '../data/barSoapSizes';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export const ProductsPage = ({ selectedCategory = 'all', setSelectedCategory, searchQuery = '', setSearchQuery }) => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'size-matrix'
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'
  const [selectedBrandLine, setSelectedBrandLine] = useState('all');
  const [productList, setProductList] = useState(() => 
    fallbackProducts.filter(p => p.inStock !== false && (p.stockQuantity === undefined || p.stockQuantity > 0))
  );
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    api.getProducts()
      .then(data => {
        if (!isMounted) return;
        const raw = data.results || (Array.isArray(data) ? data : []);
        if (raw.length > 0) {
          const formatted = raw
            .filter(p => (p.inStock !== false && p.in_stock !== false) && (p.stockQuantity === undefined || p.stockQuantity > 0) && (p.stock_quantity === undefined || p.stock_quantity > 0))
            .map(p => ({
              id: p.slug || p.id,
              slug: p.slug,
              name: p.name,
              brandLine: p.brandLine || p.brand_line || 'Batian',
              category: typeof p.category === 'object' ? p.category?.slug : (p.category || 'bar-soaps'),
              badge: p.badge || '',
              isFlagship: p.isFlagship !== undefined ? p.isFlagship : (p.is_flagship || false),
              basePrice: Number(p.basePrice || p.base_price || 0),
              defaultSize: p.defaultSize || p.default_size || 'Standard',
              shortDescription: p.shortDescription || p.short_description || '',
              fullDescription: p.fullDescription || p.full_description || '',
              ingredients: p.ingredients || '',
              ecoScore: p.ecoScore || p.eco_score || 'A+',
              inStock: true,
              stockQuantity: Number(p.stockQuantity ?? p.stock_quantity ?? 100),
              rating: Number(p.rating || 4.8),
              reviewsCount: Number(p.reviewsCount || p.reviews_count || 45),
              image: p.image || '',
              sizes: Array.isArray(p.sizes) ? p.sizes : [],
              benefits: Array.isArray(p.benefits) ? p.benefits : []
            }));
          setProductList(formatted);
        }
      })
      .catch(err => {
        console.warn('Using local catalog fallback:', err);
      });
    return () => { isMounted = false; };
  }, []);

  // Filter products by category, search, and brand line
  const filteredProducts = useMemo(() => {
    return productList.filter((p) => {
      // Category filter
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brandLine.toLowerCase().includes(q) ||
        (p.sizes && p.sizes.some(s => s.label.toLowerCase().includes(q) || (s.segment && s.segment.toLowerCase().includes(q))));

      // Brand filter
      const matchesBrand = selectedBrandLine === 'all' || p.brandLine.toLowerCase() === selectedBrandLine.toLowerCase();

      return matchesCat && matchesSearch && matchesBrand;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.basePrice - b.basePrice;
      if (sortBy === 'price-high') return b.basePrice - a.basePrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFlagship ? 1 : 0) - (a.isFlagship ? 1 : 0);
    });
  }, [productList, selectedCategory, searchQuery, selectedBrandLine, sortBy]);

  const activeCategoryObj = categories.find(c => c.id === selectedCategory) || categories[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1.5">
            <span>Ruiru Factory Direct</span>
            <span>•</span>
            <span>Certified KEBS Quality</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Explore 9 complete lines of Kenyan natural cleaning, laundry, and personal-care formulations.
          </p>
        </div>

        {/* View Switcher: Catalog vs Bar Soap Size Guide */}
        <div className="flex items-center p-1 bg-stone-200/70 rounded-xl self-start md:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            <Layers size={14} />
            <span>Products ({filteredProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('size-matrix')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'size-matrix'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            <Maximize2 size={14} />
            <span>Bar Soap Size Matrix (15g–1kg)</span>
          </button>
        </div>
      </div>

      {activeTab === 'size-matrix' ? (
        /* DEDICATED BAR SOAP SIZE SPECTRUM MATRIX TABLE */
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-2xl font-black mb-2">
              Aberdares Bar Soap Comprehensive Size Spectrum
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl">
              We manufacture bar soaps ranging from 15g single-use guest amenities up to 1-Kilogram commercial institutional blocks. Review use cases, target market segments, carton packing, and direct wholesale pricing below.
            </p>
          </div>

          <div className="md:hidden flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
            <span>👉 Swipe table sideways to compare all sizes, packs & prices</span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 text-slate-700 font-extrabold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Size (Weight)</th>
                  <th className="py-3.5 px-4">Category & Segment</th>
                  <th className="py-3.5 px-4 min-w-[240px]">Primary Use Case</th>
                  <th className="py-3.5 px-4">Flagship Variant</th>
                  <th className="py-3.5 px-4">Carton Pack</th>
                  <th className="py-3.5 px-4">Retail Price</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {barSoapSizes.map((row) => (
                  <tr key={row.weight} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-black text-sm text-aberdares-forest">
                      {row.weight}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 block">{row.category}</span>
                      <span className="text-[11px] text-emerald-700">{row.marketSegment}</span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 leading-relaxed">
                      {row.useCase}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {row.recommendedVariant}
                    </td>
                    <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                      {row.cartonQty}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">
                      KSh {row.retailPrice}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          const matchingProduct = products.find(p => p.id === 'batian-multi-bar' || p.id === 'lisa-lux-beauty-bar');
                          if (matchingProduct) {
                            addToCart(matchingProduct, row.weight, 1);
                          }
                        }}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs"
                      >
                        Order Sample
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* NORMAL PRODUCTS CATALOG VIEW */
        <div className="space-y-8">
          
          {/* Categories Pill Navigation (All 9 categories) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-aberdares-forest text-white shadow-md'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Controls Bar: Search, Brand Filter, Sort */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search within page */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword (e.g. aloe, 250g, bleach)..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <Search size={14} className="absolute left-3 top-3 text-stone-400" />
            </div>

            {/* Filter and Sort Dropdowns */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Brand Filter */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-stone-500 text-[11px] font-semibold hidden md:inline">Line:</span>
                <select
                  value={selectedBrandLine}
                  onChange={(e) => setSelectedBrandLine(e.target.value)}
                  className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">All Brand Lines</option>
                  <option value="Batian">Batian™ Series</option>
                  <option value="Lisa Lux">Lisa Lux™ Skincare</option>
                  <option value="Elsie Suds">Elsie Suds™ Clean</option>
                  <option value="Aberdares Pure">Aberdares Pure™</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-stone-500 text-[11px] font-semibold hidden md:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="featured">Featured / Flagship</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Customer Rating</option>
                </select>
              </div>
            </div>

          </div>

          {/* Active Category Heading & Count */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              {activeCategoryObj.name}
              <span className="ml-2 text-xs font-normal text-stone-500">
                ({filteredProducts.length} items available)
              </span>
            </h2>

            {(selectedCategory !== 'all' || searchQuery || selectedBrandLine !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSelectedBrandLine('all');
                }}
                className="text-xs text-emerald-800 hover:underline font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No products matched your criteria</h3>
              <p className="text-xs text-stone-500">
                Try searching for another term like "aloe", "bleach", "5L", or reset your active filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSelectedBrandLine('all');
                }}
                className="px-5 py-2 bg-aberdares-forest text-white rounded-xl text-xs font-bold"
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
