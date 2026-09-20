import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, ShieldCheck, Truck, Store, RefreshCw } from 'lucide-react';
import { STORE_PHONE, STORE_ADDRESS, STORE_HOURS, getWhatsAppUrl } from '../../utils/formatters.ts';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Where is Le-one Jewelries physically located?',
      answer: `Our boutique is physically located at Aki Cube Mall, 3rd Ave, Gwarinpa Estate, Gwarinpa 900108, Abuja (Federal Capital Territory), Nigeria. You are welcome to visit us in person to view, try on, or purchase jewelry.`
    },
    {
      question: 'What are your store opening hours?',
      answer: `We are open Monday through Sunday from 9:00 AM to 8:00 PM. Our in-store consultants and WhatsApp team are available daily during these hours.`
    },
    {
      question: 'How does delivery work in Abuja and across Nigeria?',
      answer: `We offer Abuja Standard Delivery (1–2 business days for ₦2,500, free on orders over ₦150,000), Abuja Express VIP Delivery (same-day dispatch for ₦4,500), and Nationwide Express Shipping across all 36 Nigerian states (2–4 business days for ₦5,500 via DHL/GIG Logistics). You can also select FREE store pickup at Aki Cube Mall.`
    },
    {
      question: 'Can I order directly on WhatsApp?',
      answer: `Yes! You can add products to your bag and tap "Order on WhatsApp", or tap any "Order via WhatsApp" button on product pages. Our team will verify stock and process your invoice immediately via +234 802 335 5789.`
    },
    {
      question: 'What payment methods do you accept?',
      answer: `We accept Direct Nigerian Bank Transfers (Zenith Bank), Paystack (Debit cards, USSD, Apple Pay), Flutterwave, and Pay on Pickup (Cash or POS card swipe upon in-person collection at Aki Cube Mall).`
    },
    {
      question: 'Are the jewelry pieces durable and hypoallergenic?',
      answer: `All our jewelry pieces are crafted with premium materials including 18K/24K vacuum gold plating, solid 925 sterling silver, titanium steel, AAA cubic zirconia, and authentic pearls. They are nickel-free, lead-free, and designed to resist tarnish with proper care.`
    },
    {
      question: 'What is your return and exchange policy?',
      answer: `We provide a 7-day return/exchange window for unworn items in their original luxury packaging with proof of purchase. Please note that earrings and custom sized pieces cannot be returned for hygiene and customization reasons.`
    },
    {
      question: 'Can I see the jewelry before paying?',
      answer: `Yes, you can choose "Store Pickup (Aki Cube Mall, Gwarinpa)" at checkout and inspect the jewelry in person before making your payment via cash or POS card swipe.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
          Customer Support & Answers
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-neutral-600 max-w-xl mx-auto">
          Find instant answers about our Abuja physical store, online checkout, payment safety, and nationwide delivery.
        </p>
      </div>

      {/* Accordion FAQ list */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all ${
                isOpen ? 'border-[#B8860B] bg-amber-50/20' : 'border-neutral-200 bg-white'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4"
              >
                <span className="font-serif text-base sm:text-lg font-bold text-neutral-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#B8860B] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions banner */}
      <div className="p-8 bg-neutral-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif text-xl font-bold">Still have a question?</h3>
          <p className="text-xs text-neutral-400">
            Our team in Gwarinpa, Abuja is available on WhatsApp daily from 9am to 8pm.
          </p>
        </div>
        <a
          href={getWhatsAppUrl('Hello Le-one Jewelries, I have a question not answered in your FAQ.')}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>

    </div>
  );
};
