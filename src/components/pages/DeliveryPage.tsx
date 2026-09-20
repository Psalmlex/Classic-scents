import React from 'react';
import { Truck, Store, ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import { STORE_ADDRESS, STORE_HOURS, formatNaira } from '../../utils/formatters.ts';
import { OrderTrackingStatus } from '../orders/OrderTrackingStatus.tsx';

interface DeliveryPageProps {
  onShopClick: () => void;
}

export const DeliveryPage: React.FC<DeliveryPageProps> = ({ onShopClick }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
          Shipping & Pickups
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900">
          Delivery & Store Pickup Information
        </h1>
        <p className="text-sm text-neutral-600 max-w-2xl mx-auto">
          Swift, insured delivery across Abuja, express courier to all 36 Nigerian states, and free in-store collection at Aki Cube Mall, Gwarinpa.
        </p>
      </div>

      {/* Live Order Tracking Component */}
      <OrderTrackingStatus />

      {/* 4 Delivery Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Abuja Standard */}
        <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-neutral-900 text-[#D4AF37] rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-[#B8860B]">{formatNaira(2500)}</span>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">Abuja Standard Delivery</h3>
            <p className="text-xs text-emerald-700 font-semibold mt-0.5">FREE on orders over ₦150,000</p>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Delivered directly to your residential or office address across all Abuja districts (Gwarinpa, Maitama, Wuse 2, Asokoro, Jabi, Utako, Garki, Guzape, Lugbe, Kubwa, etc.) within <strong>1–2 business days</strong>.
          </p>
        </div>

        {/* Abuja VIP Express */}
        <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-[#B8860B] text-white rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-[#B8860B]">{formatNaira(4500)}</span>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">Abuja Express VIP Dispatch</h3>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">Same-Day Priority Courier</p>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Orders placed before 2:00 PM are hand-delivered the <strong>same day</strong> in discreet luxury gift packaging across municipal Abuja districts.
          </p>
        </div>

        {/* Nationwide Express */}
        <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-neutral-900 text-[#D4AF37] rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-[#B8860B]">{formatNaira(5500)}</span>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">Nationwide Express Shipping</h3>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">All 36 Nigerian States</p>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Shipped via trusted domestic logistics partners (DHL, GIG Logistics, FedEx). Takes <strong>2–4 business days</strong> with live tracking codes provided via SMS and WhatsApp.
          </p>
        </div>

        {/* Free Store Pickup */}
        <div className="p-6 bg-amber-50/60 rounded-2xl border border-amber-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-neutral-900 text-[#D4AF37] rounded-xl">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-emerald-700">FREE</span>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">Store Pickup (Gwarinpa Boutique)</h3>
            <p className="text-xs text-neutral-600 font-medium mt-0.5">Ready within 2 hours</p>
          </div>
          <p className="text-xs text-neutral-700 leading-relaxed">
            Collect your order in person at <strong>Aki Cube Mall, 3rd Ave, Gwarinpa Estate, Abuja</strong> during store hours ({STORE_HOURS}). Pay in advance or pay on pickup via POS card/cash.
          </p>
        </div>

      </div>

      {/* Packaging & Safety */}
      <div className="p-8 bg-neutral-900 text-white rounded-3xl space-y-4">
        <h3 className="font-serif text-2xl font-bold">Luxury & Tamper-Proof Packaging</h3>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
          Every piece from Le-one Jewelries is placed inside our signature custom presentation box with a protective velvet insert and sealed in a secure outer mailer to ensure your fine jewelry arrives in pristine, ready-to-wear condition.
        </p>
        <button
          onClick={onShopClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#B8860B] text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
        >
          <span>Shop Our Collection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
