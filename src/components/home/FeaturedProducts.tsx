import React, { useState } from 'react';
import { ArrowRight, Sparkles, Flame, Tag, Clock } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { ProductCard } from '../common/ProductCard.tsx';

interface FeaturedProductsProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onViewDetails: (productId: string) => void;
  onViewAll: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products = [],
  onQuickView,
  onViewDetails,
  onViewAll
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'new_arrival' | 'best_seller' | 'on_sale'>('all');

  const filteredProducts = (products || []).filter(p => {
    if (!p) return false;
    if (activeTab === 'new_arrival') return p.isNewArrival;
    if (activeTab === 'best_seller') return p.isBestSeller;
    if (activeTab === 'on_sale') return p.discountPercent && p.discountPercent > 0;
    return p.isFeatured || true;
  });

  return (
    <section id="featured-collection" className="py-16 sm:py-20 bg-neutral-50/60 border-y border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-1.5 text-[#B8860B] text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Signature Selection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-bold tracking-tight">
              Featured Collection
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              Handpicked jewelry pieces reflecting Abuja's standard of elegance, available in-store and online.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-200/60 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Featured
            </button>
            <button
              onClick={() => setActiveTab('new_arrival')}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'new_arrival'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#B8860B]" />
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('best_seller')}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'best_seller'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab('on_sale')}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'on_sale'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-neutral-600 hover:text-rose-600'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-rose-600" />
              Special Offers
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-md transition-all active:scale-[0.98]"
          >
            <span>Explore All {products.length} Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
