import React, { useState, useEffect } from 'react';
import {
  CreditCard, Truck, ShieldCheck, MapPin, Phone, MessageCircle, Copy, Check,
  ArrowLeft, Store, Building, Sparkles, AlertCircle, ShoppingBag, Landmark
} from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { DeliveryMethod, PaymentMethod, Order, StoreSettings } from '../../types/index.ts';
import { formatNaira, STORE_ADDRESS, STORE_PHONE, getWhatsAppUrl } from '../../utils/formatters.ts';
import { apiService } from '../../services/api.ts';
import { OrderConfirmationModal } from './OrderConfirmationModal.tsx';

interface CheckoutPageProps {
  onBackToCart: () => void;
  onContinueShopping: () => void;
}

const NIGERIAN_STATES = [
  'Abuja (FCT)', 'Lagos', 'Rivers', 'Kano', 'Kaduna', 'Oyo', 'Enugu', 'Delta',
  'Edo', 'Anambra', 'Ogun', 'Akwa Ibom', 'Plateau', 'Imo', 'Abia', 'Cross River',
  'Bauchi', 'Benue', 'Borno', 'Bayelsa', 'Ebonyi', 'Ekiti', 'Gombe', 'Jigawa',
  'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Ondo', 'Osun',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToCart,
  onContinueShopping
}) => {
  const {
    items,
    subtotal,
    discount,
    appliedCoupon,
    deliveryMethod,
    setDeliveryMethod,
    deliveryFee,
    total,
    clearCart,
    freeDeliveryThreshold
  } = useCart();

  const { user } = useAuth();
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    let isMounted = true;
    apiService.getSettings().then(data => {
      if (isMounted && data) {
        setStoreSettings(data);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    street: '',
    city: 'Gwarinpa',
    state: 'Abuja (FCT)',
    postalCode: '',
    deliveryNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [selectedBankOption, setSelectedBankOption] = useState<'primary' | 'secondary'>('primary');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <p className="text-sm text-neutral-600">Your bag is empty.</p>
        <button
          onClick={onContinueShopping}
          className="mt-4 px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const handleCopyAccount = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');

    if (!formData.fullName || !formData.phone || !formData.email) {
      setOrderError('Please complete all required contact fields (Name, Phone, Email).');
      return;
    }

    if (deliveryMethod !== 'store_pickup' && !formData.street) {
      setOrderError('Please enter your delivery street address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerWhatsapp: formData.whatsapp || formData.phone,
        deliveryAddress: {
          street: deliveryMethod === 'store_pickup' ? 'Store Pickup: Aki Cube Mall, Gwarinpa' : formData.street,
          city: formData.city || 'Abuja',
          state: formData.state,
          country: 'Nigeria',
          postalCode: formData.postalCode,
          deliveryNotes: formData.deliveryNotes
        },
        items,
        subtotal,
        discountAmount: discount,
        deliveryFee,
        totalAmount: total,
        deliveryMethod,
        paymentMethod,
        appliedCoupon: appliedCoupon || undefined,
        notes: formData.deliveryNotes
      };

      const response = await apiService.createOrder(orderPayload);
      if (response.order) {
        setConfirmedOrder(response.order);
        clearCart();
      } else {
        setOrderError('Could not process order. Please try again or chat via WhatsApp.');
      }
    } catch (err: any) {
      console.error(err);
      setOrderError('An error occurred during checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="checkout-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200 mb-8">
        <button
          onClick={onBackToCart}
          className="text-xs font-semibold text-neutral-500 hover:text-[#B8860B] flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shopping Bag
        </button>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Le-one Jewelries Boutique • Aki Cube Mall, Gwarinpa, Abuja
        </p>
      </div>

      {orderError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{orderError}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Columns (Form) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Customer Contact Info */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-[#D4AF37] text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  Customer & Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zainab Ibrahim"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Phone Number (Calls) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 802 000 0000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    WhatsApp Number (for Dispatch Updates)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +234 802 335 5789"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Method & Address */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-[#D4AF37] text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  Delivery Method & Location
                </h3>
              </div>

              {/* Method Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'abuja_standard',
                    name: 'Abuja Standard Delivery',
                    time: '1–2 business days',
                    fee: subtotal >= freeDeliveryThreshold ? 0 : 2500
                  },
                  {
                    id: 'abuja_express',
                    name: 'Abuja Express VIP Delivery',
                    time: 'Same-day VIP dispatch',
                    fee: 4500
                  },
                  {
                    id: 'nationwide',
                    name: 'Nationwide Courier',
                    time: '2–4 business days via DHL/GIG',
                    fee: 5500
                  },
                  {
                    id: 'store_pickup',
                    name: 'Store Pickup (Gwarinpa)',
                    time: 'Aki Cube Mall, 3rd Ave',
                    fee: 0
                  }
                ].map(opt => (
                  <label
                    key={opt.id}
                    onClick={() => setDeliveryMethod(opt.id as DeliveryMethod)}
                    className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                      deliveryMethod === opt.id
                        ? 'border-[#B8860B] bg-amber-50/60 ring-2 ring-[#D4AF37]/30'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">{opt.name}</span>
                      <span className="text-xs font-bold text-[#B8860B]">
                        {opt.fee === 0 ? 'FREE' : formatNaira(opt.fee)}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 mt-1">{opt.time}</span>
                  </label>
                ))}
              </div>

              {/* Physical Address Fields (if not store pickup) */}
              {deliveryMethod !== 'store_pickup' ? (
                <div className="space-y-4 pt-2 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Street Address / House No / Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 14, 4th Avenue, Near Gwarinpa Model Market"
                      value={formData.street}
                      onChange={e => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                        City / Town / Estate
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Gwarinpa / Maitama / Wuse 2"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                        State / Territory
                      </label>
                      <select
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                      >
                        {NIGERIAN_STATES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Delivery Instructions / Gate Code (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Call before arrival, leave with security at main gate"
                      value={formData.deliveryNotes}
                      onChange={e => setFormData({ ...formData, deliveryNotes: e.target.value })}
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <Store className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-neutral-900">Pickup at Physical Boutique:</p>
                      <p className="text-neutral-700 mt-0.5">{STORE_ADDRESS}</p>
                      <p className="text-[11px] text-neutral-500 mt-1">Open 9:00 AM – 8:00 PM Daily. Please show your order ID at the counter.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Payment Options */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-[#D4AF37] text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  Payment Method
                </h3>
              </div>

              <div className="space-y-3">
                {/* Bank Transfer */}
                <label
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-xl border block cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#B8860B] bg-amber-50/50 ring-2 ring-[#D4AF37]/30'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-[#B8860B]" />
                      <div>
                        <p className="text-xs font-bold text-neutral-900">Direct Bank Transfer (Instant Verification)</p>
                        <p className="text-[11px] text-neutral-500">Transfer directly to our official corporate account</p>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center">
                      {paymentMethod === 'bank_transfer' && <span className="w-2 h-2 rounded-full bg-[#B8860B]" />}
                    </span>
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 pt-3 border-t border-amber-200/80 bg-white p-3.5 rounded-xl text-xs space-y-3 shadow-xs">
                      {storeSettings?.bankDetails?.secondaryBankName && storeSettings?.bankDetails?.secondaryAccountNumber && (
                        <div className="flex gap-2 p-1 bg-neutral-100 rounded-lg">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSelectedBankOption('primary'); }}
                            className={`flex-1 py-1 px-2 rounded-md text-[11px] font-bold transition-colors ${
                              selectedBankOption === 'primary' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                            }`}
                          >
                            Primary: {storeSettings?.bankDetails?.bankName || 'GTBank'}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSelectedBankOption('secondary'); }}
                            className={`flex-1 py-1 px-2 rounded-md text-[11px] font-bold transition-colors ${
                              selectedBankOption === 'secondary' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                            }`}
                          >
                            Alt: {storeSettings?.bankDetails?.secondaryBankName}
                          </button>
                        </div>
                      )}

                      {selectedBankOption === 'primary' ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500">Bank Name:</span>
                            <strong className="text-neutral-900 font-semibold">
                              {storeSettings?.bankDetails?.bankName || 'Guaranty Trust Bank (GTBank)'}
                            </strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500">Account Name:</span>
                            <strong className="text-neutral-900 font-semibold">
                              {storeSettings?.bankDetails?.accountName || 'Le-one Jewelries Ltd'}
                            </strong>
                          </div>
                          <div className="flex justify-between items-center bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/60">
                            <span className="text-neutral-600 font-medium">Account Number:</span>
                            <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-900 text-sm">
                              <span>{storeSettings?.bankDetails?.accountNumber || '0812345678'}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyAccount(storeSettings?.bankDetails?.accountNumber || '0812345678');
                                }}
                                className="p-1 text-[#B8860B] hover:text-neutral-900 transition-colors"
                                title="Copy Account Number"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500">Bank Name:</span>
                            <strong className="text-neutral-900 font-semibold">
                              {storeSettings?.bankDetails?.secondaryBankName || 'OPay'}
                            </strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500">Account Name:</span>
                            <strong className="text-neutral-900 font-semibold">
                              {storeSettings?.bankDetails?.secondaryAccountName || 'Le-one Jewelries Abuja'}
                            </strong>
                          </div>
                          <div className="flex justify-between items-center bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/60">
                            <span className="text-neutral-600 font-medium">Account Number:</span>
                            <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-900 text-sm">
                              <span>{storeSettings?.bankDetails?.secondaryAccountNumber || ''}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyAccount(storeSettings?.bankDetails?.secondaryAccountNumber || '');
                                }}
                                className="p-1 text-[#B8860B] hover:text-neutral-900 transition-colors"
                                title="Copy Account Number"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {copiedBank && (
                        <p className="text-[10px] text-emerald-600 font-semibold text-right">✓ Account number copied to clipboard!</p>
                      )}

                      {storeSettings?.bankDetails?.paymentInstructions && (
                        <div className="pt-2 border-t border-neutral-200/80 text-[11px] text-neutral-600 italic bg-neutral-50 p-2 rounded-lg">
                          💡 <strong>Payment Note:</strong> {storeSettings.bankDetails.paymentInstructions}
                        </div>
                      )}
                    </div>
                  )}
                </label>

                {/* Paystack Online Payment */}
                <label
                  onClick={() => setPaymentMethod('paystack')}
                  className={`p-4 rounded-xl border block cursor-pointer transition-all ${
                    paymentMethod === 'paystack'
                      ? 'border-[#B8860B] bg-amber-50/50 ring-2 ring-[#D4AF37]/30'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs font-bold text-neutral-900">Paystack (Debit Card, USSD, Apple Pay)</p>
                        <p className="text-[11px] text-neutral-500">Mastercard, Visa, Verve & Nigerian bank transfer</p>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center">
                      {paymentMethod === 'paystack' && <span className="w-2 h-2 rounded-full bg-[#B8860B]" />}
                    </span>
                  </div>
                </label>

                {/* Flutterwave */}
                <label
                  onClick={() => setPaymentMethod('flutterwave')}
                  className={`p-4 rounded-xl border block cursor-pointer transition-all ${
                    paymentMethod === 'flutterwave'
                      ? 'border-[#B8860B] bg-amber-50/50 ring-2 ring-[#D4AF37]/30'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="text-xs font-bold text-neutral-900">Flutterwave (Card & Mobile Money)</p>
                        <p className="text-[11px] text-neutral-500">Fast checkout with any Nigerian bank card</p>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center">
                      {paymentMethod === 'flutterwave' && <span className="w-2 h-2 rounded-full bg-[#B8860B]" />}
                    </span>
                  </div>
                </label>

                {/* Pay on Pickup */}
                <label
                  onClick={() => setPaymentMethod('pay_on_pickup')}
                  className={`p-4 rounded-xl border block cursor-pointer transition-all ${
                    paymentMethod === 'pay_on_pickup'
                      ? 'border-[#B8860B] bg-amber-50/50 ring-2 ring-[#D4AF37]/30'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Store className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-neutral-900">Pay on Pickup at Aki Cube Mall Boutique</p>
                        <p className="text-[11px] text-neutral-500">Pay in cash or POS card terminal upon inspecting jewelry</p>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center">
                      {paymentMethod === 'pay_on_pickup' && <span className="w-2 h-2 rounded-full bg-[#B8860B]" />}
                    </span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-5 sticky top-24">
              <h3 className="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100 flex items-center justify-between">
                <span>Items in Order ({items.length})</span>
                <span className="text-xs font-sans text-neutral-500 font-normal">All prices in NGN (₦)</span>
              </h3>

              {/* Items List */}
              <div className="divide-y divide-neutral-100 max-h-64 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={item.product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg border" />
                      <div>
                        <p className="text-xs font-semibold text-neutral-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-[11px] text-neutral-500">Qty: {item.quantity} × {formatNaira(item.product.price)}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-neutral-900 font-serif">
                      {formatNaira(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-200 pt-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatNaira(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span>-{formatNaira(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Cost</span>
                  <span className="font-semibold text-neutral-900">
                    {deliveryFee === 0 ? 'FREE' : formatNaira(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                  <span className="font-serif text-lg">Total Due</span>
                  <span className="font-serif text-xl text-[#B8860B]">{formatNaira(total)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:brightness-110 text-neutral-950 text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing Order...' : 'Complete & Place Order'}</span>
                </button>

                <p className="text-[11px] text-neutral-500 text-center">
                  By placing your order, you agree to Le-one Jewelries' Terms and Return Policy.
                </p>
              </div>

            </div>
          </div>

        </div>
      </form>

      {/* Confirmation Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          onContinueShopping={() => {
            setConfirmedOrder(null);
            onContinueShopping();
          }}
        />
      )}

    </div>
  );
};
