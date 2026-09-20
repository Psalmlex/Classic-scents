import React from 'react';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { formatNaira, getProductWhatsAppMessage } from '../../utils/formatters.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onViewDetails: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onViewDetails
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-xl overflow-hidden border border-neutral-200/80 hover:border-[#D4AF37]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 cursor-pointer" onClick={() => onViewDetails(product.id)}>
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="px-2 py-0.5 bg-rose-600 text-white text-[11px] font-bold rounded-md uppercase tracking-wider shadow-xs">
              -{product.discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-neutral-900 text-[#D4AF37] text-[11px] font-semibold rounded-md uppercase tracking-wider shadow-xs">
              New Arrival
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="px-2 py-0.5 bg-[#B8860B] text-white text-[11px] font-semibold rounded-md uppercase tracking-wider shadow-xs">
              Best Seller
            </span>
          )}
          {product.isDemo && (
            <span className="px-2 py-0.5 bg-neutral-800/80 backdrop-blur-xs text-neutral-300 text-[9px] font-mono rounded tracking-tight">
              Demo Item
            </span>
          )}
        </div>

        {/* Wishlist Button on Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 shadow-sm ${
            isFavorited
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/90 text-neutral-600 hover:text-rose-500 hover:bg-white backdrop-blur-xs'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 px-3 bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-semibold rounded-lg shadow-md hover:bg-[#B8860B] hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span className="uppercase tracking-wider font-medium text-[11px] text-[#B8860B]">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-neutral-700">{(product.rating ?? 5.0).toFixed(1)}</span>
              <span className="text-neutral-400">({product.reviewCount ?? 0})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onViewDetails(product.id)}
            className="font-serif text-base text-neutral-900 font-semibold line-clamp-1 group-hover:text-[#B8860B] transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-neutral-900">
              {formatNaira(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-neutral-400 line-through">
                {formatNaira(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-neutral-100 flex items-center gap-2">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isOutOfStock
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-900 text-white hover:bg-[#B8860B] active:scale-[0.98] shadow-xs'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
          </button>

          {/* Mobile Quick View button */}
          <button
            onClick={() => onQuickView(product)}
            className="sm:hidden p-2 text-neutral-700 hover:text-neutral-900 border border-neutral-200 rounded-lg hover:bg-neutral-50"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
