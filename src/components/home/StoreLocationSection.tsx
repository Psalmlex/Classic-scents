import React from 'react';
import { MapPin, Clock, Phone, MessageCircle, Navigation, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { STORE_PHONE, STORE_HOURS, STORE_ADDRESS, GOOGLE_MAPS_URL, getWhatsAppUrl } from '../../utils/formatters.ts';

export const StoreLocationSection: React.FC = () => {
  return (
    <section id="visit-store-section" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-[#B8860B] text-xs font-bold uppercase tracking-widest rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Physical Jewelry Store in Abuja</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 font-bold tracking-tight">
              Visit Our Store
            </h2>

            <p className="text-base sm:text-lg text-neutral-700 font-serif italic">
              "Prefer to see your jewelry in person? Visit Le-one Jewelries at Aki Cube Mall, Gwarinpa, Abuja."
            </p>

            <p className="text-sm text-neutral-600 leading-relaxed">
              Step into our boutique to experience the weight, sparkle, and craftsmanship of our collections firsthand. Our friendly jewelry consultants in Gwarinpa are ready to help you find the ideal piece for yourself or as a memorable gift.
            </p>

            {/* Address & Hours Cards */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-start gap-4">
                <div className="p-2.5 bg-[#D4AF37]/20 text-[#B8860B] rounded-lg shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Physical Address</h4>
                  <p className="text-sm font-semibold text-neutral-900 mt-0.5">{STORE_ADDRESS}</p>
                  <p className="text-xs text-neutral-500 mt-1">Ground & First Floor Retail Wings, Aki Cube Mall</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-start gap-4">
                <div className="p-2.5 bg-[#D4AF37]/20 text-[#B8860B] rounded-lg shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Boutique Opening Hours</h4>
                  <p className="text-sm font-semibold text-neutral-900 mt-0.5">{STORE_HOURS}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Open Today • In-store pickup available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-[#D4AF37]" />
                <span>Get Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={getWhatsAppUrl('Hello Le-one Jewelries, I would like to visit your Aki Cube Mall store today.')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Contact Store Team</span>
              </a>
            </div>

          </div>

          {/* Right Visual / Map Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-xl aspect-[16/11] bg-neutral-100">
              {/* Interactive OpenStreetMap Embed for Gwarinpa, Abuja */}
              <iframe
                title="Le-one Jewelries Abuja Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=7.405%2C9.100%2C7.428%2C9.120&amp;layer=mapnik&amp;marker=9.1095%2C7.4165"
                className="w-full h-full border-0"
                loading="lazy"
              />

              {/* Map Floating Card */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs p-3.5 bg-white/95 backdrop-blur-md rounded-xl border border-neutral-200 shadow-lg text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <p className="font-bold text-neutral-900">Le-one Jewelries</p>
                </div>
                <p className="text-neutral-600 text-[11px] mt-1">Aki Cube Mall, 3rd Ave, Gwarinpa Estate, Abuja</p>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-[#B8860B] font-semibold text-[11px] flex items-center gap-1 hover:underline"
                >
                  Open in Google Maps App <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Boutique Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-700">
              <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free In-Store Try Ons</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Immediate Ring Sizing</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Secure POS & Cash Payment</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
