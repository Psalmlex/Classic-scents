import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppUrl, STORE_PHONE } from '../../utils/formatters.ts';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div id="floating-whatsapp-widget" className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Small popover message */}
      {showTooltip && (
        <div className="mb-2 max-w-xs bg-white p-3 rounded-xl shadow-xl border border-neutral-200 text-xs text-neutral-800 animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1.5 right-1.5 text-neutral-400 hover:text-neutral-700 p-0.5"
            aria-label="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="font-semibold text-neutral-900 pr-3">Need Help or Custom Orders?</p>
          <p className="text-neutral-600 text-[11px] mt-0.5">
            Chat with Le-one Jewelries Abuja store directly on WhatsApp.
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={getWhatsAppUrl('Hello Le-one Jewelries, I am reaching out from your website.')}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95 group"
        aria-label={`Chat with Le-one Jewelries on WhatsApp (${STORE_PHONE})`}
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
};
