import React, { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, Download, ShoppingBag, MapPin, Phone, ArrowRight, Printer, Landmark, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, StoreSettings } from '../../types/index.ts';
import { formatNaira, STORE_ADDRESS, STORE_PHONE, getWhatsAppUrl } from '../../utils/formatters.ts';
import { apiService } from '../../services/api.ts';

interface OrderConfirmationModalProps {
  order: Order;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onContinueShopping
}) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  useEffect(() => {
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#AA771C', '#111111', '#25D366']
      });
    } catch {}

    apiService.getSettings().then(data => {
      if (data) {
        setSettings(data);
      }
    }).catch(() => {});
  }, []);

  const orderId = order.orderNumber || order.id || 'LEO-2026';
  const totalVal = order.total ?? order.totalAmount ?? 0;
  const customerName = order.customer?.fullName || order.customerName || 'Valued Customer';
  const paymentMethodName = (order.paymentMethod || 'paystack').replace('_', ' ');

  const deliveryDest = order.delivery?.address
    ? `${order.delivery.address.street || order.delivery.address.address || ''}, ${order.delivery.address.city || 'Abuja'}, ${order.delivery.address.state || 'FCT'}`
    : order.deliveryAddress
    ? `${order.deliveryAddress.street || order.deliveryAddress.address || ''}, ${order.deliveryAddress.city || 'Abuja'}, ${order.deliveryAddress.state || 'FCT'}`
    : order.delivery?.methodName || (order.deliveryMethod === 'store_pickup' ? 'Store Pickup: Aki Cube Mall, Gwarinpa' : STORE_ADDRESS);

  const whatsappMessage = `Hello Le-one Jewelries, I have just placed Order #${orderId}. Total amount: ₦${totalVal.toLocaleString()}. Please confirm my order status.`;
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-neutral-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
            Order Confirmed
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Thank You For Your Order!
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
            Your order reference is <strong className="font-mono text-neutral-900">{orderId}</strong>. We have received your order details at our Aki Cube Mall store.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 text-xs space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-neutral-200 pb-3">
            <div>
              <p className="text-neutral-400 uppercase text-[10px] font-bold">Order ID</p>
              <p className="font-mono font-bold text-neutral-900 mt-0.5">{orderId}</p>
            </div>
            <div>
              <p className="text-neutral-400 uppercase text-[10px] font-bold">Customer</p>
              <p className="font-semibold text-neutral-900 mt-0.5">{customerName}</p>
            </div>
            <div>
              <p className="text-neutral-400 uppercase text-[10px] font-bold">Payment Method</p>
              <p className="font-semibold text-neutral-900 mt-0.5 uppercase">{paymentMethodName}</p>
            </div>
            <div>
              <p className="text-neutral-400 uppercase text-[10px] font-bold">Total Paid/Due</p>
              <p className="font-bold text-[#B8860B] text-sm mt-0.5">{formatNaira(totalVal)}</p>
            </div>
          </div>

          {/* Bank Transfer Payment Instructions for User */}
          {order.paymentMethod === 'bank_transfer' && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[#B8860B] font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <Landmark className="w-4 h-4" />
                  Bank Transfer Payment Information:
                </span>
                {copiedBank && <span className="text-[10px] text-emerald-600">Copied!</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white/80 p-2.5 rounded-lg border border-amber-100 text-[11px]">
                <div>
                  <span className="text-neutral-500">Bank:</span>
                  <p className="font-bold text-neutral-900">{settings?.bankDetails?.bankName || 'Guaranty Trust Bank (GTBank)'}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Account Name:</span>
                  <p className="font-bold text-neutral-900">{settings?.bankDetails?.accountName || 'Le-one Jewelries Ltd'}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Account Number:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-neutral-900">
                    <span>{settings?.bankDetails?.accountNumber || '0812345678'}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings?.bankDetails?.accountNumber || '0812345678')}
                      className="p-1 text-[#B8860B] hover:text-neutral-900"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              {settings?.bankDetails?.paymentInstructions && (
                <p className="text-[11px] text-neutral-600 italic">
                  💡 {settings.bankDetails.paymentInstructions}
                </p>
              )}
            </div>
          )}

          {/* Items Breakdown */}
          <div className="space-y-2">
            <p className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">Ordered Items:</p>
            <div className="divide-y divide-neutral-200/60 max-h-36 overflow-y-auto pr-1">
              {(order.items || []).map((item, idx) => {
                const itemName = item.name || item.product?.name || 'Jewelry Piece';
                const itemImg = item.image || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
                const itemPrice = item.price ?? item.product?.price ?? 0;
                const itemQty = item.quantity || 1;

                return (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={itemImg} alt="" className="w-9 h-9 object-cover rounded border" />
                      <div>
                        <p className="font-semibold text-neutral-900 line-clamp-1">{itemName}</p>
                        <p className="text-[11px] text-neutral-500">Qty: {itemQty} × {formatNaira(itemPrice)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900 font-serif">
                      {formatNaira(itemPrice * itemQty)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Store Pickup Address */}
          <div className="pt-2 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-600 gap-2">
            <div>
              <strong>Delivery / Pickup Destination:</strong>
              <p>{deliveryDest}</p>
            </div>
            <div className="text-right sm:text-right">
              <strong>Support Phone:</strong>
              <p>{STORE_PHONE}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Send Order Confirmation on WhatsApp</span>
          </a>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={onContinueShopping}
              className="flex-1 py-3 px-4 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Back to Jewelry Shop</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
