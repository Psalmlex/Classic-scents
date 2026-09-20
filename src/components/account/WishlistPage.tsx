import React from 'react';
import { Heart, ShoppingBag, ArrowLeft, Trash2, Sparkles } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { Product } from '../../types/index.ts';
import { ProductCard } from '../common/ProductCard.tsx';

interface WishlistPageProps {
  allProducts: Product[];
  onContinueShopping: () => void;
  onQuickView: (product: Product) => void;
  onViewDetails: (productId: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  allProducts = [],
  onContinueShopping,
  onQuickView,
  onViewDetails
}) => {
  const { wishlistIds = [], clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const favoriteProducts = (allProducts || []).filter(p => p && (wishlistIds || []).includes(p.id));

  const handleAddAllToCart = () => {
    favoriteProducts.forEach(p => {
      if (p && p.stock > 0) {
        addToCart(p, 1);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4 mb-8">
        <div>
          <button
            onClick={onContinueShopping}
            className="text-xs font-semibold text-neutral-500 hover:text-[#B8860B] flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
              My Saved Wishlist ({favoriteProducts.length})
            </h1>
          </div>
        </div>

        {favoriteProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddAllToCart}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase rounded-lg transition-all shadow-xs"
            >
              Add All to Bag
            </button>
            <button
              onClick={clearWishlist}
              className="px-3 py-2 text-xs text-neutral-500 hover:text-rose-600 transition-colors"
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-neutral-900">Your wishlist is currently empty</h3>
          <p className="text-xs text-neutral-500">
            Save your favorite gold necklaces, diamond earrings, luxury watches and bridal sets by tapping the heart icon on any piece.
          </p>
          <button
            onClick={onContinueShopping}
            className="px-6 py-3 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-lg"
          >
            Discover Jewelry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map(product => (
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
  );
};
