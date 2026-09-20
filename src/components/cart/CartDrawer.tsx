import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, MessageCircle, Sparkles, Tag, Check, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { formatNaira, getCartWhatsAppMessage } from '../../utils/formatters.ts';

interface CartDrawerProps {
  onCheckout: () => void;
  onContinueShopping: () => void;
  onViewProduct: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onCheckout,
  onContinueShopping,
  onViewProduct
}) => {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    appliedCoupon,
    deliveryFee,
    total,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    freeDeliveryThreshold,
    amountToFreeDelivery,
    getWhatsAppOrderUrl
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const res = await applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
    setCouponLoading(false);
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div id="cart-drawer" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-neutral-200">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B8860B]" />
              <h2 className="font-serif text-lg font-bold text-neutral-900">
                Shopping Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-200/60 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="px-5 py-3 bg-amber-50/60 border-b border-amber-100/80 text-xs">
            <div className="flex items-center justify-between text-neutral-800 mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#B8860B]" />
                {amountToFreeDelivery === 0 ? (
                  <strong className="text-emerald-700">Congratulations! You qualify for Free Abuja Delivery.</strong>
                ) : (
                  <span>
                    Add <strong>{formatNaira(amountToFreeDelivery)}</strong> more for Free Abuja Delivery
                  </span>
                )}
              </span>
              <span className="font-bold text-[#B8860B]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D4AF37] to-[#AA771C] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-neutral-900">Your bag is empty</h3>
                  <p className="text-xs text-neutral-500 max-w-xs">
                    Discover fine gold necklaces, rings, earrings and luxury watches crafted with elegance.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              (items || []).map((item, idx) => {
                const img = item.product?.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
                const name = item.product?.name || 'Jewelry Piece';
                const price = item.product?.price ?? 0;
                const pid = item.productId || item.product?.id || '';
                const stock = item.product?.stock ?? 99;

                return (
                  <div key={`${pid}-${idx}`} className="py-4 flex gap-4">
                    {/* Thumbnail */}
                    <img
                      src={img}
                      alt={name}
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        if (pid) onViewProduct(pid);
                      }}
                      className="w-20 h-20 object-cover rounded-lg border border-neutral-200 shrink-0 cursor-pointer"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            onClick={() => {
                              setIsCartDrawerOpen(false);
                              if (pid) onViewProduct(pid);
                            }}
                            className="font-serif text-sm font-semibold text-neutral-900 truncate hover:text-[#B8860B] cursor-pointer"
                          >
                            {name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(pid, item.selectedVariations)}
                            className="text-neutral-400 hover:text-rose-600 p-0.5 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Selected Variations */}
                        {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            {Object.entries(item.selectedVariations)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' • ')}
                          </p>
                        )}

                        <p className="text-xs font-bold text-neutral-900 mt-1">
                          {formatNaira(price)}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-200 rounded-md">
                          <button
                            onClick={() => updateQuantity(pid, item.quantity - 1, item.selectedVariations)}
                            className="p-1 text-neutral-600 hover:bg-neutral-100 text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-neutral-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(pid, item.quantity + 1, item.selectedVariations)}
                            className="p-1 text-neutral-600 hover:bg-neutral-100 text-xs"
                            disabled={item.quantity >= stock}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-[#B8860B]">
                          {formatNaira(price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-4">
              
              {/* Coupon input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      Code: <strong className="font-mono">{appliedCoupon}</strong> (-{formatNaira(discount)})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-neutral-500 hover:text-rose-600 font-bold ml-2 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-3 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </div>

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatNaira(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatNaira(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span>{deliveryFee === 0 ? 'Calculated at checkout' : formatNaira(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span className="font-serif text-base">Total</span>
                  <span className="font-serif text-base text-[#B8860B]">{formatNaira(total)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2">
                <button
                  id="drawer-checkout-btn"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onCheckout();
                  }}
                  className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* WhatsApp Order Whole Bag */}
                <a
                  href={getWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[#25D366]/40 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Order Entire Bag on WhatsApp</span>
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
