import React from 'react';
import { Store, ShieldCheck, Truck, MessageCircle, Gem } from 'lucide-react';
import { STORE_PHONE } from '../../utils/formatters.ts';

export const TrustSection: React.FC = () => {
  const trustItems = [
    {
      icon: Store,
      title: 'Physical Store in Abuja',
      description: 'Visit our boutique at Aki Cube Mall, 3rd Ave, Gwarinpa Estate.'
    },
    {
      icon: Gem,
      title: 'Quality Jewelry',
      description: 'Carefully selected gold-plated, zirconia, pearls and timeless accessories.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Shopping',
      description: 'Protected Nigerian payments via Paystack, Flutterwave & Bank Transfer.'
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      description: 'Same/Next-day Abuja delivery & express shipping across all Nigerian states.'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Support',
      description: `Direct ordering and customer assistance on ${STORE_PHONE}.`
    }
  ];

  return (
    <section id="trust-section" className="bg-white border-b border-neutral-200/80 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50/70 border border-neutral-100 hover:border-[#D4AF37]/40 hover:bg-amber-50/20 transition-all duration-200"
              >
                <div className="p-2.5 rounded-lg bg-neutral-900 text-[#D4AF37] shrink-0 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-neutral-900 font-serif tracking-wide">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
