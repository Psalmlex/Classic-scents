import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Clock, Send, Star, ExternalLink, CheckCircle2, Store } from 'lucide-react';
import { STORE_ADDRESS, STORE_HOURS, STORE_PHONE, GOOGLE_MAPS_URL, getWhatsAppUrl } from '../../utils/formatters.ts';

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Jewelry Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setSubmitted(true);
  };

  const getCustomWhatsAppUrl = () => {
    const text = `Hello Le-one Jewelries Abuja!\nMy Name: ${form.name || 'Website Visitor'}\nPhone: ${form.phone || 'N/A'}\nSubject: ${form.subject}\nMessage: ${form.message || 'I would like to inquire about your jewelry store.'}`;
    return getWhatsAppUrl(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-14">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
          Get in Touch & Visit
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900">
          Visit Our Store & Contact Us
        </h1>
        <p className="text-sm text-neutral-600">
          Whether you want to visit our physical boutique in Gwarinpa, Abuja, or need custom order assistance, we are ready to assist you.
        </p>
      </div>

      {/* Main Grid: Info Cards + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Physical Address */}
          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#D4AF37]/20 text-[#B8860B] rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">Physical Store Location</h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-700 font-medium pl-11">
              {STORE_ADDRESS}
            </p>
            <div className="pl-11 pt-2">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#B8860B] font-bold hover:underline"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#D4AF37]/20 text-[#B8860B] rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">Boutique Opening Hours</h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-700 font-medium pl-11">
              {STORE_HOURS}
            </p>
            <p className="text-xs text-emerald-700 font-semibold pl-11">
              Open 7 days a week for walk-in shopping and store pickups.
            </p>
          </div>

          {/* Phone & WhatsApp */}
          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#D4AF37]/20 text-[#B8860B] rounded-lg">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">Phone & WhatsApp Direct</h3>
            </div>
            <div className="pl-11 space-y-2">
              <p className="text-sm font-bold text-neutral-900">{STORE_PHONE}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`tel:${STORE_PHONE.replace(/\s+/g, '')}`}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold"
                >
                  Call Boutique
                </a>
                <a
                  href={getWhatsAppUrl('Hello Le-one Jewelries, I would like to make an inquiry.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp Store</span>
                </a>
              </div>
            </div>
          </div>

          {/* Rating Snapshot */}
          <div className="p-5 bg-neutral-900 text-white rounded-2xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-neutral-400 mt-1">4.7 / 5.0 Rating on Google Reviews</p>
            </div>
            <span className="text-xs font-bold text-[#D4AF37] uppercase">Verified Boutique</span>
          </div>

        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
            Send a Direct Message
          </h2>
          <p className="text-xs text-neutral-500 mb-6">
            Fill out the form below and our Abuja customer team will respond shortly. You can also trigger an immediate WhatsApp chat.
          </p>

          {submitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-emerald-900">Message Received!</h3>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                Thank you for contacting Le-one Jewelries. Our team at Aki Cube Mall will review your request promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs text-emerald-800 font-bold underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chinedu Okafor"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 802 000 0000"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Inquiry Reason
                  </label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="Jewelry Inquiry">General Jewelry Inquiry</option>
                    <option value="Store Visit & Appointment">Store Visit / In-Person Try On</option>
                    <option value="Custom Jewelry Order">Custom / Bridal Jewelry Design</option>
                    <option value="Delivery Status">Track Existing Delivery</option>
                    <option value="Wholesale / Partnership">Wholesale & Business Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you today with your jewelry selection?"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Website Message</span>
                </button>

                <a
                  href={getCustomWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Open Directly on WhatsApp</span>
                </a>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* Map Embed Section */}
      <div className="pt-6 border-t border-neutral-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-neutral-900">Store Location Map</h3>
            <p className="text-xs text-neutral-500">Aki Cube Mall, 3rd Ave, Gwarinpa Estate, Abuja</p>
          </div>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#B8860B] font-bold hover:underline flex items-center gap-1"
          >
            <span>Google Maps Navigation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="w-full h-80 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100">
          <iframe
            title="Le-one Jewelries Location Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=7.405%2C9.100%2C7.428%2C9.120&amp;layer=mapnik&amp;marker=9.1095%2C7.4165"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>

    </div>
  );
};
