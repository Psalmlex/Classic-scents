import React, { useState } from 'react';
import { X, Star, ShoppingBag, MessageCircle, Heart, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { formatNaira, getProductWhatsAppMessage, getWhatsAppUrl } from '../../utils/formatters.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetails: (productId: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onViewFullDetails
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (Array.isArray(product?.variations)) {
      product.variations.forEach(v => {
        if (v && Array.isArray(v.options) && v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
    }
    return initial;
  });

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleVariationChange = (variationName: string, option: string) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationName]: option
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariations);
    onClose();
  };

  const whatsappMessage = getProductWhatsAppMessage(product.name, product.price);
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div
          id="quickview-modal"
          className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-neutral-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-neutral-900 bg-white/80 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Gallery Column */}
            <div className="p-6 bg-neutral-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-200 mb-4">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-rose-600 text-white text-xs font-bold rounded uppercase">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === idx ? 'border-[#B8860B] ring-2 ring-amber-100' : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Column */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & SKU */}
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="uppercase tracking-widest text-[#B8860B] font-semibold">{product.category}</span>
                  <span className="font-mono">SKU: {product.sku}</span>
                </div>

                {/* Title */}
                <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-bold leading-snug">
                  {product.name}
                </h2>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating ?? 5) ? 'fill-current' : 'text-neutral-300'}`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-neutral-800">{(product.rating ?? 5.0).toFixed(1)}</span>
                  <span className="text-neutral-500">({product.reviewCount ?? 0} customer reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 py-2 border-y border-neutral-100">
                  <span className="text-2xl font-bold text-neutral-900 font-serif">
                    {formatNaira(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-neutral-400 line-through">
                      {formatNaira(product.originalPrice)}
                    </span>
                  )}
                  {product.stock > 0 && product.stock <= product.lowStockThreshold && (
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Only {product.stock} left in stock
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Variations */}
                {product.variations && product.variations.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {product.variations.map(v => (
                      <div key={v.name} className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                          {v.name}: <span className="text-neutral-900 normal-case font-normal">{selectedVariations[v.name]}</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {v.options.map(opt => {
                            const isSelected = selectedVariations[v.name] === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() => handleVariationChange(v.name, opt)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                                  isSelected
                                    ? 'border-[#B8860B] bg-amber-50/80 text-[#B8860B] font-semibold ring-1 ring-[#D4AF37]'
                                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-sm font-semibold text-neutral-900 min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 text-sm font-bold"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      isOutOfStock
                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        : 'bg-neutral-900 text-white hover:bg-[#B8860B] shadow-md active:scale-[0.98]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 border rounded-lg transition-colors ${
                      isFavorited ? 'border-rose-300 text-rose-500 bg-rose-50' : 'border-neutral-300 text-neutral-700 hover:text-rose-500'
                    }`}
                    title={isFavorited ? 'In Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* WhatsApp Direct Product Inquiry */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white border border-[#25D366]/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  Ask About This on WhatsApp (+234 802 335 5789)
                </a>

                {/* View Full Product Page */}
                <button
                  onClick={() => {
                    onClose();
                    onViewFullDetails(product.id);
                  }}
                  className="w-full text-center text-xs font-semibold text-neutral-600 hover:text-[#B8860B] py-1 flex items-center justify-center gap-1"
                >
                  View Full Product Details & Materials <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
