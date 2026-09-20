import React, { useState } from 'react';
import { Shield, RefreshCw, FileText, Lock } from 'lucide-react';
import { STORE_ADDRESS, STORE_PHONE } from '../../utils/formatters.ts';

interface PolicyPageProps {
  initialTab?: 'returns' | 'privacy' | 'terms';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ initialTab = 'returns' }) => {
  const [tab, setTab] = useState<'returns' | 'privacy' | 'terms'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      
      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 border-b border-neutral-200 pb-4">
        {[
          { id: 'returns', label: 'Returns & Exchanges', icon: RefreshCw },
          { id: 'privacy', label: 'Privacy Policy', icon: Lock },
          { id: 'terms', label: 'Terms & Conditions', icon: FileText }
        ].map(t => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4 text-[#D4AF37]" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-10 shadow-xs prose prose-sm max-w-none text-neutral-700 leading-relaxed">
        {tab === 'returns' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold text-neutral-900">Returns & Exchanges Policy</h1>
            <p className="text-xs text-neutral-500">Last updated: January 2026 • Le-one Jewelries Abuja</p>

            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-neutral-900">1. 7-Day Return & Exchange Window</h3>
              <p>
                At Le-one Jewelries, we want you to love your jewelry. If you are not completely satisfied with your purchase, you may initiate a return or exchange within <strong>7 calendar days</strong> from the date of physical receipt or in-store pickup.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-neutral-900">2. Eligibility Conditions</h3>
              <p>To qualify for a full refund or exchange:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600">
                <li>Items must be unworn, undamaged, unaltered, and free of perfumes or cosmetics.</li>
                <li>Items must be returned in the original Le-one Jewelries luxury gift packaging and pouch.</li>
                <li>Proof of purchase (Order reference number or invoice receipt) must be presented.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-neutral-900">3. Non-Returnable Items</h3>
              <p>
                For hygiene reasons, pierced earrings cannot be returned or exchanged unless there is an intrinsic manufacturer defect. Custom engraved or specially tailored jewelry items are also final sale.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-neutral-900">4. Return Process in Abuja</h3>
              <p>
                You can return items directly to our physical store at <strong>{STORE_ADDRESS}</strong> during regular opening hours, or arrange return dispatch via courier after notifying our WhatsApp customer team on <strong>{STORE_PHONE}</strong>.
              </p>
            </section>
          </div>
        )}

        {tab === 'privacy' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold text-neutral-900">Privacy Policy</h1>
            <p className="text-xs text-neutral-500">Last updated: January 2026</p>

            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-neutral-900">1. Information We Collect</h3>
              <p>
                We collect information necessary to fulfill your jewelry orders, including your name, email address, delivery street address, phone number, and WhatsApp contact. We do not store full credit card numbers on our servers; payments are processed securely via verified third-party payment gateways (Paystack, Flutterwave, and direct Nigerian banking rails).
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-neutral-900">2. How We Use Your Data</h3>
              <p>
                Your information is solely used to process orders, verify deliveries, send dispatch tracking alerts, and provide responsive WhatsApp customer support. We never sell, rent, or trade your personal data to third parties.
              </p>
            </section>
          </div>
        )}

        {tab === 'terms' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold text-neutral-900">Terms & Conditions of Sale</h1>
            <p className="text-xs text-neutral-500">Last updated: January 2026</p>

            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-neutral-900">1. Pricing & Currency</h3>
              <p>
                All prices on this website are listed in Nigerian Naira (₦). Prices are subject to change without prior notice due to prevailing gold and currency exchange market dynamics.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-neutral-900">2. Authenticity & Warranty</h3>
              <p>
                Le-one Jewelries guarantees that all products correspond to their listed descriptions and specifications at the time of purchase.
              </p>
            </section>
          </div>
        )}
      </div>

    </div>
  );
};
