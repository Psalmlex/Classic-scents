import React, { useState } from 'react';
import { User, Package, MapPin, Phone, Mail, Search, CheckCircle, Clock, Truck, Store, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { formatNaira, formatDate, STORE_ADDRESS } from '../../utils/formatters.ts';
import { OrderTrackingStatus } from '../orders/OrderTrackingStatus.tsx';

interface AccountPageProps {
  onNavigateToShop: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigateToShop }) => {
  const { user, loginUser, logoutUser } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginUser(email, name || 'Valued Customer', phone, whatsapp);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="pb-8 border-b border-neutral-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
            Customer Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
            {user ? `Welcome, ${user.fullName}` : 'Account & Order Tracking'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Track package fulfillment stages or manage your boutique client profile.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Profile or Auth Form */}
        <div className="lg:col-span-5 space-y-6">
          {user ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 text-[#D4AF37] flex items-center justify-center font-serif text-lg font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-neutral-900">{user.fullName}</h3>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logoutUser}
                  className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-neutral-700">
                  <Phone className="w-4 h-4 text-[#B8860B]" />
                  <span>Phone: <strong>{user.phone || 'Not specified'}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Mail className="w-4 h-4 text-[#B8860B]" />
                  <span>Email: <strong>{user.email}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <MapPin className="w-4 h-4 text-[#B8860B]" />
                  <span>Physical Store: <strong>{STORE_ADDRESS}</strong></span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <button
                  onClick={onNavigateToShop}
                  className="w-full py-3 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Shop Exclusive Collections
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-4 border-b border-neutral-200 pb-3">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`font-serif text-lg font-bold pb-2 transition-all cursor-pointer ${
                    authMode === 'login' ? 'text-[#B8860B] border-b-2 border-[#D4AF37]' : 'text-neutral-400'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`font-serif text-lg font-bold pb-2 transition-all cursor-pointer ${
                    authMode === 'register' ? 'text-[#B8860B] border-b-2 border-[#D4AF37]' : 'text-neutral-400'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fatima Bello"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Phone Number (Calls/WhatsApp)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +234 802 000 0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  {authMode === 'login' ? 'Sign In to Account' : 'Register Customer Account'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Dedicated Order Tracking Status Component */}
        <div className="lg:col-span-7">
          <OrderTrackingStatus initialOrderId="LEONE-101" />
        </div>

      </div>

    </div>
  );
};
