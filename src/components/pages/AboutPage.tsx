import React from 'react';
import { Store, Gem, ShieldCheck, MapPin, Clock, Phone, Star, MessageCircle, ArrowRight } from 'lucide-react';
import { STORE_ADDRESS, STORE_HOURS, STORE_PHONE, GOOGLE_MAPS_URL, getWhatsAppUrl } from '../../utils/formatters.ts';

interface AboutPageProps {
  onShopClick: () => void;
  onContactClick: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onShopClick, onContactClick }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-[#B8860B] text-xs font-bold uppercase tracking-widest rounded-full">
          <Gem className="w-3.5 h-3.5" />
          <span>About Le-one Jewelries</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight">
          Elegance, Craftsmanship & Real Boutique Presence in Abuja
        </h1>
        <p className="text-base text-neutral-600 leading-relaxed font-light">
          Le-one Jewelries is a physical jewelry store situated at Aki Cube Mall in Gwarinpa Estate, Abuja. We bring together timeless aesthetic design, premium metals, and accessible luxury for clients across Nigeria.
        </p>
      </div>

      {/* Main Story & Values Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-neutral-700 text-sm leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            A Physical Jewelry Destination in Gwarinpa, Abuja
          </h2>
          <p>
            At Le-one Jewelries, we believe fine jewelry is more than just an accessory—it is an expression of confidence, milestone celebrations, and enduring style.
          </p>
          <p>
            Operating from our physical storefront at <strong>Aki Cube Mall, 3rd Avenue, Gwarinpa Estate</strong>, we offer our clients the unique advantage of an in-person boutique experience alongside our streamlined online ordering platform. Customers can walk into our store to inspect craftsmanship, try on rings and necklaces, or enjoy swift nationwide doorstep delivery.
          </p>
          
          {/* Verified Google Badge */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center gap-4">
            <div className="text-3xl font-serif font-bold text-neutral-900">4.7 / 5.0</div>
            <div className="text-xs space-y-0.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-neutral-600 font-medium">Customer satisfaction verified by 6 Google reviews</p>
            </div>
          </div>
        </div>

        {/* Visual Box */}
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-xl aspect-[4/3] bg-neutral-100">
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"
            alt="Le-one Jewelries Abuja Boutique"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Physical Storefront</p>
              <h3 className="font-serif text-lg font-bold">Aki Cube Mall, 3rd Ave, Gwarinpa</h3>
              <p className="text-xs text-neutral-300">Open 7 days a week: 9:00 AM – 8:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-neutral-200">
        <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
          <div className="p-3 bg-neutral-900 text-[#D4AF37] rounded-xl w-fit">
            <Gem className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-neutral-900">Authentic Curation</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Every necklace, Cuban chain, earring, and luxury timepiece is thoroughly inspected for finish, weight, stone settings, and durability before being catalogued.
          </p>
        </div>

        <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
          <div className="p-3 bg-neutral-900 text-[#D4AF37] rounded-xl w-fit">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-neutral-900">Physical Store Trust</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Shop with total peace of mind knowing you are dealing with an established physical retail jewelry boutique with verifiable contact numbers, store hours, and Google Maps location.
          </p>
        </div>

        <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
          <div className="p-3 bg-neutral-900 text-[#D4AF37] rounded-xl w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-neutral-900">Dedicated Service</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            From WhatsApp consultations and sizing guidance to prompt Abuja same-day dispatch and nationwide courier tracking, customer satisfaction is our highest priority.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="p-8 sm:p-12 bg-neutral-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">Ready to Experience Le-one?</h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg">
            Browse our latest collections online or visit us in person at Aki Cube Mall, Gwarinpa, Abuja.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onShopClick}
            className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#B8860B] text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
          >
            Shop Jewelry
          </button>
          <button
            onClick={onContactClick}
            className="px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl border border-neutral-700"
          >
            Visit Boutique
          </button>
        </div>
      </div>

    </div>
  );
};
