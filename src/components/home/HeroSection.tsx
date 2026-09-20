import React from 'react';
import { ArrowRight, MessageCircle, Sparkles, MapPin, ShieldCheck, Gem } from 'lucide-react';
import { getWhatsAppUrl } from '../../utils/formatters.ts';

interface HeroSectionProps {
  onShopClick: () => void;
  onExploreCollections: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopClick, onExploreCollections }) => {
  return (
    <section id="hero-section" className="relative bg-[#0E0E10] text-white overflow-hidden">
      {/* Background ambient gold gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#B8860B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Location Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-[#D4AF37]/30 text-xs text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-semibold tracking-wider uppercase text-[11px]">
                Physical Boutique in Aki Cube Mall, Gwarinpa, Abuja
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Jewelry That Makes <br className="hidden sm:inline" />
              <span className="gold-gradient-text italic font-normal">Every Moment</span> Special
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Discover elegant jewelry and accessories carefully selected to add beauty, confidence and timeless style to every occasion.
            </p>

            {/* Call to Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-shop-btn"
                onClick={onShopClick}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-neutral-950 font-bold text-sm uppercase tracking-widest rounded-lg shadow-lg hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                id="hero-whatsapp-btn"
                href={getWhatsAppUrl('Hello Le-one Jewelries, I would like to inquire about your collection.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-[#25D366]/20 hover:bg-[#25D366] text-white font-semibold text-sm rounded-lg border border-[#25D366]/40 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-xs text-neutral-400">Store Location</p>
                <p className="text-sm font-semibold text-white mt-0.5">Gwarinpa, Abuja</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Google Rating</p>
                <p className="text-sm font-semibold text-[#D4AF37] mt-0.5">★ 4.7 / 5.0</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Order Delivery</p>
                <p className="text-sm font-semibold text-white mt-0.5">Nationwide</p>
              </div>
            </div>
          </div>

          {/* Right Visual Display */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Luxury Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl bg-neutral-900 aspect-[4/5] group">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85"
                  alt="Le-one Jewelries Abuja luxury collection"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating Boutique badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/70 backdrop-blur-md border border-neutral-700/80 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                      Physical Store & Online
                    </span>
                    <h3 className="font-serif text-base font-semibold">Le-one Jewelries Abuja</h3>
                    <p className="text-xs text-neutral-300">Aki Cube Mall, 3rd Ave</p>
                  </div>
                  <button
                    onClick={onExploreCollections}
                    className="p-2.5 rounded-full bg-[#D4AF37] text-neutral-950 hover:bg-white transition-colors"
                    aria-label="View Collections"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Accent Floating Mini Card */}
              <div className="absolute -top-4 -left-4 hidden sm:flex items-center gap-3 p-3 rounded-xl bg-[#1A1A1E]/95 backdrop-blur-md border border-[#D4AF37]/40 shadow-xl text-xs text-white">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <Gem className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Fine Gold & Gems</p>
                  <p className="text-[10px] text-neutral-400">Curated with precision</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
