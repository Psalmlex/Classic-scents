import React from 'react';
import { MapPin, Phone, Sparkles } from 'lucide-react';
import { STORE_PHONE, STORE_HOURS } from '../../utils/formatters.ts';

export const AnnouncementBar: React.FC = () => {
  return (
    <div id="announcement-bar" className="bg-[#141414] text-[#E5E5E5] text-xs py-2 px-4 border-b border-[#262626]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-3 justify-center">
          <span className="inline-flex items-center gap-1 text-[#D4AF37] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Le-one Jewelries Abuja
          </span>
          <span className="hidden md:inline text-neutral-500">•</span>
          <span className="hidden md:flex items-center gap-1 text-neutral-300">
            <MapPin className="w-3 h-3 text-[#D4AF37]" />
            Aki Cube Mall, 3rd Ave, Gwarinpa
          </span>
          <span className="hidden lg:inline text-neutral-500">•</span>
          <span className="hidden lg:inline text-neutral-300">
            Open Daily: {STORE_HOURS.replace('Monday–Sunday: ', '')}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="text-amber-200/90 font-medium">
            Free Abuja Delivery on Orders over ₦150,000
          </span>
          <a
            href={`tel:${STORE_PHONE.replace(/\s+/g, '')}`}
            className="hidden sm:flex items-center gap-1 text-neutral-300 hover:text-[#D4AF37] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#D4AF37]" />
            {STORE_PHONE}
          </a>
        </div>
      </div>
    </div>
  );
};
