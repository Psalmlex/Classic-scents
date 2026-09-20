import React, { useState, useEffect } from 'react';
import {
  Star, ShoppingBag, MessageCircle, Heart, Share2, Check, Truck, ShieldCheck,
  MapPin, Clock, ArrowLeft, Gem, Sparkles, AlertCircle, RefreshCw, Send
} from 'lucide-react';
import { Product, Review } from '../../types/index.ts';
import { formatNaira, getProductWhatsAppMessage, getWhatsAppUrl, STORE_ADDRESS, formatDate } from '../../utils/formatters.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { ProductCard } from '../common/ProductCard.tsx';
import { apiService } from '../../services/api.ts';

interface ProductDetailPageProps {
  productId?: string;
  product?: Product;
  allProducts?: Product[];
  onBack: () => void;
  onNavigateProduct?: (id: string) => void;
  onSelectRelated?: (id: string) => void;
  onQuickView?: (product: Product) => void;
  onCheckoutDirect?: () => void;
  onBuyNow?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  product: initialProduct,
  allProducts = [],
  onBack,
  onNavigateProduct,
  onSelectRelated,
  onQuickView,
  onCheckoutDirect,
  onBuyNow
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const triggerCheckout = onCheckoutDirect || onBuyNow || (() => {});

  const product = initialProduct || (allProducts || []).find(p => p?.id === productId) || allProducts?.[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews' | 'care'>('description');
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customerName: '',
    rating: 5,
    title: '',
    comment: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    setQuantity(1);

    if (Array.isArray(product?.variations)) {
      const initial: Record<string, string> = {};
      product.variations.forEach(v => {
        if (v && Array.isArray(v.options) && v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
      setSelectedVariations(initial);
    }

    // Fetch reviews
    if (product?.id) {
      apiService.getReviews(product.id).then(res => setProductReviews(res.reviews)).catch(() => {});
    }
  }, [productId, product]);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p>Product not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded">
          Back to Shop
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariations);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariations);
    triggerCheckout();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.customerName || !reviewForm.comment) return;
    setReviewSubmitting(true);
    try {
      const newRev = await apiService.submitReview({
        productId: product.id,
        customerName: reviewForm.customerName,
        customerLocation: 'Abuja, Nigeria',
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment
      });
      setProductReviews(prev => [newRev, ...prev]);
      setReviewModal(false);
      setReviewForm({ customerName: '', rating: 5, title: '', comment: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const whatsappMessage = getProductWhatsAppMessage(product.name, product.price);
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);

  // Related products from same category
  const relatedProducts = (allProducts || [])
    .filter(p => p && p.id !== product?.id && p.category === product?.category)
    .slice(0, 4);

  return (
    <div id="product-detail-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
        <button onClick={onBack} className="hover:text-[#B8860B] flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span>/</span>
        <span className="text-neutral-700">{product.category}</span>
        <span>/</span>
        <span className="text-neutral-900 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Gallery Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/90 shadow-xs group">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded uppercase shadow-sm">
                  Save {product.discountPercent}%
                </span>
              )}
              {product.isNewArrival && (
                <span className="px-2.5 py-1 bg-neutral-900 text-[#D4AF37] text-xs font-bold rounded uppercase shadow-sm">
                  New Arrival
                </span>
              )}
              {product.isBestSeller && !product.isNewArrival && (
                <span className="px-2.5 py-1 bg-[#B8860B] text-white text-xs font-bold rounded uppercase shadow-sm">
                  Best Seller
                </span>
              )}
            </div>

            {/* Wishlist Floating Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-all ${
                isFavorited
                  ? 'bg-rose-50 text-rose-500'
                  : 'bg-white/90 text-neutral-600 hover:text-rose-500 backdrop-blur-xs'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#B8860B] ring-2 ring-amber-200'
                      : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Column (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">
                {product.category}
              </span>
              <span className="text-xs text-neutral-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating ?? 5) ? 'fill-current' : 'text-neutral-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-800">{(product.rating ?? 5.0).toFixed(1)}</span>
              <span className="text-xs text-neutral-500">({product.reviewCount ?? 0} customer reviews)</span>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-neutral-900">
                  {formatNaira(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatNaira(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Stock Status Indicator */}
              <div>
                {product.stock > 10 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> In Stock (Abuja)
                  </span>
                ) : product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5" /> Only {product.stock} left
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Variations Selector */}
          {product.variations && product.variations.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-neutral-100">
              {product.variations.map(v => (
                <div key={v.name} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-neutral-700">{v.name}:</span>
                    <span className="font-semibold text-neutral-900">{selectedVariations[v.name]}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map(opt => {
                      const isSelected = selectedVariations[v.name] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setSelectedVariations({ ...selectedVariations, [v.name]: opt })}
                          className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                            isSelected
                              ? 'border-[#B8860B] bg-amber-50/80 text-[#B8860B] font-bold ring-2 ring-amber-100'
                              : 'border-neutral-200 text-neutral-700 hover:border-neutral-300 bg-white'
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

          {/* Quantity and Primary Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-neutral-700 hover:bg-neutral-100 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 py-3 text-sm font-semibold text-neutral-900 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="px-3.5 py-3 text-neutral-700 hover:bg-neutral-100 text-sm font-bold"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isOutOfStock
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-neutral-900 text-white hover:bg-[#B8860B] active:scale-[0.98]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>
            </div>

            {/* Buy Now Direct */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                isOutOfStock
                  ? 'hidden'
                  : 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-neutral-950 hover:brightness-110 active:scale-[0.98] shadow-md'
              }`}
            >
              Buy It Now • Instant Checkout
            </button>

            {/* WhatsApp Order Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[#25D366]/40 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order via WhatsApp (+234 802 335 5789)</span>
            </a>
          </div>

          {/* Abuja Physical Store Notice */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-xl text-xs space-y-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-neutral-900">Available for In-Store Pickup in Abuja</p>
                <p className="text-neutral-600 mt-0.5">
                  Pick up at <strong>Aki Cube Mall, 3rd Ave, Gwarinpa</strong> during store hours (9am–8pm daily).
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-amber-200/60">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" /> Abuja Delivery: 24–48 hrs
              </span>
              <button
                onClick={handleShare}
                className="text-[#B8860B] font-semibold hover:underline flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" /> {copied ? 'Link Copied!' : 'Share Product'}
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Authentic Jewelry Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              <span>7-Day Return Policy</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Section: Description, Specs, Reviews, Care */}
      <div className="mt-16 pt-10 border-t border-neutral-200">
        {/* Tab Buttons */}
        <div className="flex items-center gap-6 border-b border-neutral-200 pb-2 overflow-x-auto">
          {[
            { id: 'description', label: 'Product Details' },
            { id: 'specifications', label: 'Materials & Specs' },
            { id: 'reviews', label: `Reviews (${productReviews.length})` },
            { id: 'care', label: 'Jewelry Care Guide' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`font-serif text-base pb-3 font-semibold transition-all relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-[#B8860B]'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-8 max-w-4xl">
          {activeTab === 'description' && (
            <div className="space-y-4 text-neutral-700 text-sm leading-relaxed">
              <p>{product.description}</p>
              <p>
                Each piece in the Le-one Jewelries collection is designed to capture brilliance and durability. Whether you are dressing for a wedding in Abuja, an executive gala, or everyday luxury, this design delivers effortless elegance.
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 divide-y divide-neutral-200 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider">Metal / Material</span>
                <span className="text-neutral-900 font-medium">{product.material || 'Premium Gold Plated Brass'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider">Main Stone / Gem</span>
                <span className="text-neutral-900 font-medium">{product.stone || 'AAA Cubic Zirconia / Crystal'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider">Collection / Category</span>
                <span className="text-neutral-900 font-medium">{product.category}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider">SKU Number</span>
                <span className="text-neutral-900 font-mono">{product.sku}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider">Origin & Verification</span>
                <span className="text-neutral-900 font-medium">Inspected at Le-one Boutique, Gwarinpa, Abuja</span>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-4 text-sm text-neutral-700 leading-relaxed bg-amber-50/50 p-6 rounded-xl border border-amber-100">
              <h4 className="font-serif font-bold text-neutral-900 text-base">How to Preserve Your Jewelry's Radiance:</h4>
              <ul className="space-y-2 text-xs list-disc list-inside text-neutral-600">
                <li>Avoid direct contact with perfumes, hairsprays, lotions, and harsh household chemicals.</li>
                <li>Store each piece separately in a soft velvet pouch or lined jewelry box to prevent scratching.</li>
                <li>Remove jewelry before swimming in chlorinated pools or engaging in vigorous physical exercise.</li>
                <li>Gently wipe with a microfiber polishing cloth after wearing to remove skin oils and maintain luster.</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-neutral-900">Verified Customer Reviews</h4>
                  <p className="text-xs text-neutral-500">Based on real customer feedback</p>
                </div>
                <button
                  onClick={() => setReviewModal(true)}
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase rounded-lg hover:bg-[#B8860B]"
                >
                  Write Review
                </button>
              </div>

              {productReviews.length === 0 ? (
                <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-xs text-neutral-500">No reviews yet for this product. Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {productReviews.map(rev => (
                    <div key={rev.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900">{rev.customerName}</span>
                          {rev.isVerified && (
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-neutral-400">{formatDate(rev.date)}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-300'}`} />
                        ))}
                      </div>
                      {rev.title && <h5 className="text-xs font-bold text-neutral-900">"{rev.title}"</h5>}
                      <p className="text-xs text-neutral-600 italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">You May Also Like</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
                Related {product.category}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard
                key={rel.id}
                product={rel}
                onQuickView={onQuickView || (() => {})}
                onViewDetails={onNavigateProduct || onSelectRelated || (() => {})}
              />
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-neutral-200 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-neutral-900">Review {product.name}</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fatima K."
                  value={reviewForm.customerName}
                  onChange={e => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Stunning craftsmanship"
                  value={reviewForm.title}
                  onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Your Comments *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write your feedback..."
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModal(false)}
                  className="flex-1 py-2 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="flex-1 py-2 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold rounded-lg"
                >
                  {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
