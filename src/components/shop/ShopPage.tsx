import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles, Check, ChevronDown } from 'lucide-react';
import { Product, Category } from '../../types/index.ts';
import { ProductCard } from '../common/ProductCard.tsx';
import { formatNaira } from '../../utils/formatters.ts';

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSearch?: string;
  initialTag?: string;
  onQuickView: (product: Product) => void;
  onViewDetails: (productId: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products = [],
  categories = [],
  initialCategory = '',
  initialSearch = '',
  initialTag = '',
  onQuickView,
  onViewDetails
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(300000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync props if passed from navigation
  useEffect(() => {
    if (initialCategory !== undefined) setSelectedCategory(initialCategory);
    if (initialSearch !== undefined) setSearchQuery(initialSearch);
    if (initialTag !== undefined) setSelectedTag(initialTag);
  }, [initialCategory, initialSearch, initialTag]);

  // Extract unique materials
  const materials = useMemo(() => {
    const set = new Set<string>();
    (products || []).forEach(p => {
      if (p?.material) set.add(p.material);
    });
    return Array.from(set);
  }, [products]);

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    return (products || []).filter(p => {
      if (!p) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchCat = (p.category || '').toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchDesc) return false;
      }

      // Category
      if (selectedCategory && selectedCategory !== 'All') {
        if ((p.category || '').toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // Tags
      if (selectedTag === 'new_arrival' && !p.isNewArrival) return false;
      if (selectedTag === 'best_seller' && !p.isBestSeller) return false;
      if (selectedTag === 'on_sale' && (!p.discountPercent || p.discountPercent <= 0)) return false;

      // Material
      if (selectedMaterial && p.material !== selectedMaterial) return false;

      // Price
      if (p.price > priceRange) return false;

      // In stock
      if (inStockOnly && p.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, searchQuery, selectedCategory, selectedTag, selectedMaterial, priceRange, inStockOnly, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
    setSelectedMaterial('');
    setPriceRange(300000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTag || selectedMaterial || inStockOnly || priceRange < 300000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Shop Header */}
      <div className="pb-8 border-b border-neutral-200">
        <div className="flex items-center gap-1.5 text-[#B8860B] text-xs font-bold uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Le-one Jewelries Catalogue</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
          {selectedCategory ? `${selectedCategory} Collection` : 'All Jewelry Collections'}
        </h1>
        <p className="text-sm text-neutral-600 mt-2 max-w-2xl">
          Browse handcrafted necklaces, earrings, luxury watches, bangles, and bridal sets available online and at our Aki Cube Mall boutique in Gwarinpa, Abuja.
        </p>
      </div>

      {/* Control Bar: Search & Sort & Mobile Filter Toggle */}
      <div className="my-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, metal, category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side Sort & Mobile Filter Button */}
        <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#B8860B]" />
            <span>Filters {hasActiveFilters && '• Active'}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-neutral-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">New Arrivals First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-3 space-y-6 p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <span className="font-serif text-base font-bold text-neutral-900">Filter Products</span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#B8860B] font-semibold hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-500">Categories</h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                  !selectedCategory
                    ? 'bg-amber-50 text-[#B8860B] font-bold'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[11px] text-neutral-400">{(products || []).length}</span>
              </button>
              {(categories || []).map(cat => {
                const catName = cat?.name || '';
                const isSelected = selectedCategory.toLowerCase() === catName.toLowerCase();
                const count = (products || []).filter(p => (p?.category || '').toLowerCase() === catName.toLowerCase()).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? '' : catName)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50 text-[#B8860B] font-bold'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{catName}</span>
                    <span className="text-[11px] text-neutral-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2 pt-3 border-t border-neutral-100">
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-500">Highlights</h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'new_arrival', label: 'New Arrivals' },
                { id: 'best_seller', label: 'Best Sellers' },
                { id: 'on_sale', label: 'Special Sale' }
              ].map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(selectedTag === tag.id ? '' : tag.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selectedTag === tag.id
                      ? 'border-[#B8860B] bg-amber-50 text-[#B8860B] font-semibold'
                      : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-2 pt-3 border-t border-neutral-100">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
              <span className="uppercase tracking-wider text-neutral-500">Max Budget</span>
              <span className="text-[#B8860B]">{formatNaira(priceRange)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="300000"
              step="5000"
              value={priceRange}
              onChange={e => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#B8860B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>₦10,000</span>
              <span>₦300,000+</span>
            </div>
          </div>

          {/* Materials */}
          {materials.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-neutral-100">
              <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-500">Metal & Material</h4>
              <div className="space-y-1">
                {materials.map(mat => (
                  <label
                    key={mat}
                    className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer hover:text-neutral-900 py-1"
                  >
                    <input
                      type="radio"
                      name="material"
                      checked={selectedMaterial === mat}
                      onChange={() => setSelectedMaterial(selectedMaterial === mat ? '' : mat)}
                      className="accent-[#B8860B]"
                    />
                    <span>{mat}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* In Stock toggle */}
          <div className="pt-3 border-t border-neutral-100">
            <label className="flex items-center gap-2.5 text-xs text-neutral-800 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#B8860B] accent-[#B8860B]"
              />
              <span>In-Stock Ready for Dispatch Only</span>
            </label>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs">
              <span className="text-neutral-500 font-medium">Active Filters:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 rounded-md font-semibold text-neutral-800">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSelectedCategory('')} />
                </span>
              )}
              {selectedTag && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 rounded-md font-semibold text-neutral-800">
                  Tag: {selectedTag.replace('_', ' ')}
                  <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSelectedTag('')} />
                </span>
              )}
              {selectedMaterial && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 rounded-md font-semibold text-neutral-800">
                  Material: {selectedMaterial}
                  <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSelectedMaterial('')} />
                </span>
              )}
              {priceRange < 300000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 rounded-md font-semibold text-neutral-800">
                  Under {formatNaira(priceRange)}
                  <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setPriceRange(300000)} />
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 rounded-md font-semibold text-neutral-800">
                  Search: "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSearchQuery('')} />
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 font-bold hover:underline ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>
              Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> jewelry pieces
            </span>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
              <div className="w-12 h-12 rounded-full bg-neutral-200 mx-auto flex items-center justify-center text-neutral-500">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-900">No jewelry items found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try widening your price range, clearing filters, or searching for other terms like 'gold', 'bracelet', or 'diamond'.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-[#B8860B]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl z-50 p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="font-serif text-base font-bold text-neutral-900">Filter Jewelry</span>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-neutral-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-500">Categories</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg ${
                      !selectedCategory ? 'bg-amber-50 text-[#B8860B] font-bold' : 'text-neutral-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg ${
                        selectedCategory === cat.name ? 'bg-amber-50 text-[#B8860B] font-bold' : 'text-neutral-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2 pt-3 border-t border-neutral-100">
                <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-500">Highlights</h4>
                <div className="flex flex-wrap gap-1.5">
                  {['new_arrival', 'best_seller', 'on_sale'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        selectedTag === tag ? 'border-[#B8860B] bg-amber-50 text-[#B8860B]' : 'border-neutral-200'
                      }`}
                    >
                      {tag.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2 pt-3 border-t border-neutral-100">
                <div className="flex justify-between text-xs font-bold text-neutral-900">
                  <span>Max Budget</span>
                  <span className="text-[#B8860B]">{formatNaira(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="300000"
                  step="5000"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#B8860B]"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 text-neutral-600 text-xs font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
