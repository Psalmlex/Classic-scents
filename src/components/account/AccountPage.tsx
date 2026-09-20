import React, { useState } from 'react';
import { User, Package, MapPin, Phone, Mail, Search, CheckCircle, Clock, Truck, Store, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { formatNaira, formatDate, STORE_ADDRESS } from '../../utils/formatters.ts';
import { apiService } from '../../services/api.ts';
import { Order } from '../../types/index.ts';

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

  // Order Tracker lookup
  const [lookupOrderId, setLookupOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginUser(email, name || 'Valued Customer', phone, whatsapp);
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupOrderId.trim()) return;

    setTrackLoading(true);
    setTrackError('');
    setTrackOrderNull();

    try {
      const ord = await apiService.getOrder(lookupOrderId.trim().toUpperCase());
      if (ord) {
        setTrackedOrder(ord);
      } else {
        setTrackError('Order not found. Please verify your order number (e.g. LEONE-2026-XXXX).');
      }
    } catch {
      setTrackError('Could not locate order with that reference.');
    } finally {
      setTrackLoading(false);
    }
  };

  const setTrackOrderNull = () => setTrackedOrder(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Header */}
      <div className="pb-8 border-b border-neutral-200 mb-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
            Customer Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
            {user ? `Welcome, ${user.fullName}` : 'Account & Order Tracking'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Profile or Auth Form */}
        <div className="lg:col-span-6 space-y-6">
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
                  className="text-xs text-rose-600 font-semibold hover:underline"
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
                  className="w-full py-3 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
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
                  className={`font-serif text-lg font-bold pb-2 transition-all ${
                    authMode === 'login' ? 'text-[#B8860B] border-b-2 border-[#D4AF37]' : 'text-neutral-400'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`font-serif text-lg font-bold pb-2 transition-all ${
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
                  className="w-full py-3.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  {authMode === 'login' ? 'Sign In to Account' : 'Register Customer Account'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Live Order Tracking */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#B8860B] text-xs font-bold uppercase">
                <Package className="w-4 h-4" />
                <span>Track Your Jewelry Order</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-neutral-900">
                Live Order Tracker
              </h3>
              <p className="text-xs text-neutral-500">
                Enter your order reference code (e.g. <span className="font-mono">LEONE-2026-90412</span>) to view real-time fulfillment status.
              </p>
            </div>

            <form onSubmit={handleTrackOrder} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Enter Order Code..."
                value={lookupOrderId}
                onChange={e => setLookupOrderId(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <button
                type="submit"
                disabled={trackLoading}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{trackLoading ? '...' : 'Track'}</span>
              </button>
            </form>

            {trackError && (
              <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
                {trackError}
              </p>
            )}

            {/* Tracked Order Result Card */}
            {trackedOrder && (
              <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <div>
                    <span className="font-mono font-bold text-neutral-900 text-sm">
                      {trackedOrder.orderNumber || trackedOrder.id}
                    </span>
                    <p className="text-neutral-500 text-[11px]">{formatDate(trackedOrder.createdAt)}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    Status: {trackedOrder.orderStatus || trackedOrder.status || 'Confirmed'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p><strong>Customer:</strong> {trackedOrder.customer?.fullName || trackedOrder.customerName || 'Customer'}</p>
                  <p><strong>Total Amount:</strong> {formatNaira(trackedOrder.total ?? trackedOrder.totalAmount ?? 0)}</p>
                  <p>
                    <strong>Delivery:</strong>{' '}
                    {trackedOrder.delivery?.address
                      ? `${trackedOrder.delivery.address.street || trackedOrder.delivery.address.address || ''}, ${trackedOrder.delivery.address.city || 'Abuja'}, ${trackedOrder.delivery.address.state || 'FCT'}`
                      : trackedOrder.deliveryAddress
                      ? `${trackedOrder.deliveryAddress.street || trackedOrder.deliveryAddress.address || ''}, ${trackedOrder.deliveryAddress.city || 'Abuja'}, ${trackedOrder.deliveryAddress.state || 'FCT'}`
                      : trackedOrder.delivery?.methodName || (trackedOrder.deliveryMethod === 'store_pickup' ? 'Store Pickup (Aki Cube Mall)' : 'Abuja Delivery')}
                  </p>
                </div>

                {/* Items in order */}
                <div className="pt-2 border-t border-neutral-200">
                  <p className="font-bold text-neutral-700 mb-1">Package Contents:</p>
                  <ul className="space-y-1 text-neutral-600">
                    {(trackedOrder.items || []).map((it, i) => {
                      const itName = it.name || it.product?.name || 'Jewelry item';
                      const itPrice = it.price ?? it.product?.price ?? 0;
                      const itQty = it.quantity || 1;
                      return (
                        <li key={i} className="flex justify-between">
                          <span>{itQty}x {itName}</span>
                          <span className="font-mono">{formatNaira(itPrice * itQty)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
