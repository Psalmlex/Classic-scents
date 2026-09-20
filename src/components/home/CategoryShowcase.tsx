import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../../types/index.ts';

interface CategoryShowcaseProps {
  categories: Category[];
  onSelectCategory: (categoryName: string) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  categories = [],
  onSelectCategory
}) => {
  return (
    <section id="categories-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#B8860B] text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-bold tracking-tight">
            Shop by Category
          </h2>
          <p className="text-sm text-neutral-600 mt-1 max-w-xl">
            Explore our handcrafted necklaces, earrings, luxury watches, bridal sets, and men's accessories.
          </p>
        </div>

        <button
          onClick={() => onSelectCategory('')}
          className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-[#B8860B] flex items-center gap-1 group transition-colors self-start md:self-auto"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Grid of Visual Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {(categories || []).map((category) => (
          <div
            key={category.id}
            id={`category-card-${category.slug}`}
            onClick={() => onSelectCategory(category.name)}
            className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[3/4] bg-neutral-900 border border-neutral-200/80 hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Background Image */}
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 opacity-85 group-hover:opacity-100"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity" />

            {/* Category Information */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                {category.itemCount ? `${category.itemCount} Designs` : 'Boutique Collection'}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                {category.name}
              </h3>
              <p className="text-[11px] text-neutral-300 line-clamp-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
