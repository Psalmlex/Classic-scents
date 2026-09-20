import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, MessageCircle, Tag, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { formatNaira, getCartWhatsAppMessage } from '../../utils/formatters.ts';
import { DeliveryMethod } from '../../types/index.ts';

interface CartPageProps {
  onCheckout: () => void;
  onContinueShopping: () => void;
  onViewProduct: (productId: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
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
    deliveryMethod,
    deliveryFee,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    setDeliveryMethod,
    freeDeliveryThreshold,
    amountToFreeDelivery,
    getWhatsAppOrderUrl
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    if (res.success) {
      setCouponMsg({ type: 'success', text: res.message });
      setCouponInput('');
    } else {
      setCouponMsg({ type: 'error', text: res.message });
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 px-4 max-w-3xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-neutral-100 rounded-full mx-auto flex items-center justify-center text-neutral-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-neutral-900">Your Shopping Bag is Empty</h2>
        <p className="text-neutral-600 text-sm max-w-md mx-auto">
          Explore our collection of fine gold necklaces, bridal sets, luxury watches and jewelry accessories.
        </p>
        <button
          onClick={onContinueShopping}
          className="px-8 py-3.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-md transition-all"
        >
          Explore Jewelry Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4 mb-8">
        <div>
          <button
            onClick={onContinueShopping}
            className="text-xs font-semibold text-neutral-500 hover:text-[#B8860B] flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </button>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
            Shopping Bag ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-neutral-500 hover:text-rose-600 self-start sm:self-auto transition-colors"
        >
          Clear Entire Bag
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="mb-8 p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-neutral-800">
          <Truck className="w-4 h-4 text-[#B8860B]" />
          {amountToFreeDelivery === 0 ? (
            <span className="font-semibold text-emerald-800">
              You have unlocked Free Standard Delivery within Abuja!
            </span>
          ) : (
            <span>
              Add <strong>{formatNaira(amountToFreeDelivery)}</strong> more of fine jewelry to qualify for <strong>Free Abuja Delivery</strong>.
            </span>
          )}
        </div>
        <span className="text-[11px] text-neutral-500">Free delivery threshold: ₦150,000</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs divide-y divide-neutral-100">
            {(items || []).map((item, idx) => {
              const img = item.product?.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
              const name = item.product?.name || 'Jewelry Piece';
              const price = item.product?.price ?? 0;
              const pid = item.productId || item.product?.id || '';
              const category = item.product?.category || 'Fine Jewelry';
              const stock = item.product?.stock ?? 99;

              return (
                <div key={`${pid}-${idx}`} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <img
                    src={img}
                    alt={name}
                    onClick={() => { if (pid) onViewProduct(pid); }}
                    className="w-24 h-24 object-cover rounded-xl border border-neutral-200 cursor-pointer shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between">
                      <h3
                        onClick={() => { if (pid) onViewProduct(pid); }}
                        className="font-serif text-base font-bold text-neutral-900 hover:text-[#B8860B] cursor-pointer"
                      >
                        {name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(pid, item.selectedVariations)}
                        className="text-neutral-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-neutral-500">
                      Category: <span className="font-medium text-neutral-700">{category}</span>
                    </p>

                    {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                      <div className="text-xs text-neutral-600 bg-neutral-50 px-2.5 py-1 rounded inline-block">
                        {Object.entries(item.selectedVariations).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center border border-neutral-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(pid, item.quantity - 1, item.selectedVariations)}
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold text-neutral-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(pid, item.quantity + 1, item.selectedVariations)}
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 text-xs font-bold"
                          disabled={item.quantity >= stock}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-neutral-400">{formatNaira(price)} each</p>
                        <p className="text-base font-bold text-neutral-900 font-serif">
                          {formatNaira(price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Method Selection */}
          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-neutral-900">
              Select Preferred Delivery Option
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'abuja_standard',
                  title: 'Abuja Standard Delivery',
                  time: '1–2 business days',
                  fee: subtotal >= freeDeliveryThreshold ? 0 : 2500
                },
                {
                  id: 'abuja_express',
                  title: 'Abuja Express VIP Delivery',
                  time: 'Same-day dispatch',
                  fee: 4500
                },
                {
                  id: 'nationwide',
                  title: 'Nationwide Express Shipping',
                  time: '2–4 business days via DHL/GIG',
                  fee: 5500
                },
                {
                  id: 'store_pickup',
                  title: 'Store Pickup (Aki Cube Mall, Gwarinpa)',
                  time: 'Ready within 2 hours',
                  fee: 0
                }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setDeliveryMethod(opt.id as DeliveryMethod)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === opt.id
                      ? 'border-[#B8860B] bg-amber-50/50 ring-1 ring-[#D4AF37]'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">{opt.title}</span>
                    <span className="text-xs font-bold text-[#B8860B]">
                      {opt.fee === 0 ? 'FREE' : formatNaira(opt.fee)}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">{opt.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Order Summary
            </h3>

            {/* Coupon field */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <div>
                    <span className="font-bold text-emerald-900">Coupon: {appliedCoupon}</span>
                    <p className="text-[11px] text-emerald-700">You saved {formatNaira(discount)}</p>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-rose-600 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-lg hover:bg-neutral-800"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-[11px] ${couponMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-neutral-900">{formatNaira(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Savings</span>
                  <span>-{formatNaira(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-neutral-900">
                  {deliveryFee === 0 ? 'FREE' : formatNaira(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                <span className="font-serif">Estimated Total</span>
                <span className="font-serif text-lg text-[#B8860B]">{formatNaira(total)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={onCheckout}
                className="w-full py-4 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[#25D366]/40 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 text-[11px] text-neutral-500 space-y-1.5 text-center">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Safe checkout with buyer protection</span>
              </p>
              <p>Physical store pickup also available at Aki Cube Mall, Gwarinpa.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
