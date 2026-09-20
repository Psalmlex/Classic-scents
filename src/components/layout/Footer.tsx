import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Shield, Star, Gem, ArrowUpRight, Lock } from 'lucide-react';
import { STORE_PHONE, STORE_HOURS, STORE_ADDRESS, GOOGLE_MAPS_URL, getWhatsAppUrl } from '../../utils/formatters.ts';
import { NewsletterSignup } from './NewsletterSignup.tsx';

interface FooterProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="main-footer" className="bg-[#111111] text-neutral-300 border-t border-neutral-800">
      {/* Upper VIP / Newsletter Section */}
      <div className="border-b border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Newsletter Signup Component with local validation */}
          <NewsletterSignup />

          {/* Boutique Visit & Fast WhatsApp Contact Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-6 border-t border-neutral-800/80">
            <div className="text-center lg:text-left max-w-xl">
              <h3 className="font-serif text-lg sm:text-xl text-white font-bold tracking-wide">
                The Le-one Jewelries Boutique
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Visit our physical showroom at Aki Cube Mall, Gwarinpa, Abuja, or speak directly with our private jewelers via WhatsApp for bespoke orders and inquiries.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href={getWhatsAppUrl('Hello Le-one Jewelries, I would like to join your VIP customer list.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold rounded-lg transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Chat Directly on WhatsApp
              </a>

              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg border border-neutral-700 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                Store Directions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-column Grid */}
      <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Boutique Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Gem className="w-6 h-6 text-[#D4AF37]" />
              <span className="font-serif text-xl tracking-[0.2em] font-bold text-white uppercase">
                LE-ONE JEWELRIES
              </span>
            </div>
            
            <p className="text-sm text-neutral-400 leading-relaxed pr-4">
              Physical jewelry boutique situated at Aki Cube Mall, Gwarinpa, Abuja. Offering fine necklaces, earrings, luxury wristwatches, bracelets, bridal sets, and men's jewelry.
            </p>

            {/* Google Rating Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-white">4.7 / 5.0</span>
              <span className="text-neutral-500">• 6 Google Reviews</span>
            </div>

            <div className="pt-2 text-xs text-neutral-400 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{STORE_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{STORE_HOURS}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`tel:${STORE_PHONE.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {STORE_PHONE}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-widest text-white font-semibold">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-[#D4AF37] transition-colors">
                  All Jewelry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-[#D4AF37] transition-colors">
                  Collections
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { tag: 'new_arrival' })} className="hover:text-[#D4AF37] transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { tag: 'best_seller' })} className="hover:text-[#D4AF37] transition-colors">
                  Best Sellers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-[#D4AF37] transition-colors">
                  My Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Delivery */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-widest text-white font-semibold">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#D4AF37] transition-colors">
                  FAQ & Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('delivery')} className="hover:text-[#D4AF37] transition-colors">
                  Delivery Information
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy', { tab: 'returns' })} className="hover:text-[#D4AF37] transition-colors">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#D4AF37] transition-colors">
                  Store Location & Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-[#D4AF37] transition-colors">
                  Order Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Physical Store */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-widest text-white font-semibold">
              Boutique & Policies
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#D4AF37] transition-colors">
                  About Le-one
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy', { tab: 'privacy' })} className="hover:text-[#D4AF37] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policy', { tab: 'terms' })} className="hover:text-[#D4AF37] transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#D4AF37] transition-colors text-amber-200/90"
                >
                  <span>Google Maps Pin</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-xs text-neutral-400 font-medium">Safe Payments In Nigeria:</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono">
                  Paystack
                </span>
                <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono">
                  Flutterwave
                </span>
                <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[10px] text-neutral-300 font-mono">
                  Bank Transfer
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-neutral-800/80 py-6 px-4 text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Le-one Jewelries. All rights reserved.</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              Verified Boutique in Abuja, Nigeria
            </span>
            <span className="text-neutral-700 hidden sm:inline">•</span>
            {/* Discreet staff link */}
            <button
              id="footer-staff-access-btn"
              onClick={() => onNavigate('admin')}
              className="group inline-flex items-center gap-1.5 text-neutral-500 hover:text-[#D4AF37] transition-colors cursor-pointer text-[11px]"
              title="Staff Administration Portal"
            >
              <Lock className="w-3 h-3 text-neutral-500 group-hover:text-[#D4AF37] transition-colors" />
              <span>Staff Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
