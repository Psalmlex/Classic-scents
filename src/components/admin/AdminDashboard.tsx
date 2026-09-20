import React, { useState, useEffect } from 'react';
import {
  Shield, Package, ShoppingCart, Tag, Star, Settings, Plus, Edit, Trash2,
  Check, X, AlertCircle, RefreshCw, MessageCircle, DollarSign, TrendingUp,
  Eye, EyeOff, LogOut, Search, Filter, Save, Landmark, CreditCard, Copy,
  CheckCircle2, Building, Wallet, ExternalLink, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Product, Order, Review, Coupon, Category, StoreSettings } from '../../types/index.ts';
import { apiService } from '../../services/api.ts';
import { formatNaira, formatDate, getWhatsAppUrl } from '../../utils/formatters.ts';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onRefreshData: () => void;
}

const POPULAR_NIGERIAN_BANKS = [
  'Guaranty Trust Bank (GTBank)',
  'Zenith Bank Plc',
  'Access Bank Plc',
  'First Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Kuda Microfinance Bank',
  'OPay Digital Services',
  'Palmpay',
  'Moniepoint Microfinance Bank',
  'Fidelity Bank Plc',
  'Stanbic IBTC Bank',
  'Sterling Bank Plc',
  'Wema Bank (ALAT)',
  'Union Bank of Nigeria',
  'First City Monument Bank (FCMB)',
  'Ecobank Nigeria',
  'Jaiz Bank',
  'Providus Bank',
  'Other / Custom Bank'
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin, onRefreshData }) => {
  const { isAdmin, adminKey, adminLogin, adminLogout } = useAuth();

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'reviews' | 'coupons' | 'payments' | 'settings'>('analytics');
  const [copiedTestAccount, setCopiedTestAccount] = useState(false);
  const [showSecondaryBank, setShowSecondaryBank] = useState(false);

  // Admin Data
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  // Product Edit/Add Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Coupon Create Modal
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minOrderAmount: 0,
    expiresAt: ''
  });

  // Filter States
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    const key = adminKey || '';
    try {
      const [an, pr, ord, rev, coup, cat, set] = await Promise.all([
        apiService.getAnalytics(key),
        apiService.getProducts({ limit: 100 }),
        apiService.getOrders({ adminKey: key }),
        apiService.getReviews(undefined, true),
        apiService.getCoupons(key),
        apiService.getCategories(),
        apiService.getSettings()
      ]);
      setAnalytics(an);
      setProducts(pr.products);
      setOrders(ord);
      setReviews(rev.reviews);
      setCoupons(coup);
      setCategories(cat);
      setSettings(set);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await adminLogin(passwordInput);
    if (!res.success) {
      setAuthError(res.error || 'Invalid administrator password.');
    } else {
      setPasswordInput('');
    }
  };

  // Product actions
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;
    const key = adminKey || '';

    try {
      if (editingProduct.id) {
        await apiService.updateProduct(editingProduct.id, editingProduct, key);
        setActionMsg('Product updated successfully!');
      } else {
        await apiService.createProduct(editingProduct as any, key);
        setActionMsg('New jewelry piece added!');
      }
      setProductModalOpen(false);
      setEditingProduct(null);
      loadAdminData();
      onRefreshData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this jewelry piece?')) return;
    const key = adminKey || '';
    try {
      await apiService.deleteProduct(id, key);
      loadAdminData();
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: any) => {
    const key = adminKey || '';
    try {
      await apiService.updateOrderStatus(orderId, { orderStatus: status }, key);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleReviewApproval = async (reviewId: string) => {
    const key = adminKey || '';
    try {
      await apiService.toggleReviewApproval(reviewId, key);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    const key = adminKey || '';
    try {
      await apiService.createCoupon(newCoupon, key);
      setCouponModalOpen(false);
      setNewCoupon({ code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, expiresAt: '' });
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    const key = adminKey || '';
    try {
      await apiService.deleteCoupon(code, key);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const key = adminKey || '';
    try {
      await apiService.updateSettings(settings, key);
      setActionMsg('Store policies and settings updated!');
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // If not authenticated as admin, show login screen
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-900 text-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-neutral-900">Le-one Boutique Portal</h2>
            <p className="text-xs text-neutral-500">
              Enter authorized administrator credentials to manage orders, inventory, and boutique operations.
            </p>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter administrator password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Access Administrator Dashboard
            </button>
          </form>

          <button
            onClick={onExitAdmin}
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            ← Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = (orders || []).filter(o => {
    if (!o) return false;
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  // Filtered products
  const filteredProducts = (products || []).filter(p => {
    if (!p) return false;
    if (!productSearch) return true;
    const name = p.name || '';
    const category = p.category || '';
    return name.toLowerCase().includes(productSearch.toLowerCase()) || category.toLowerCase().includes(productSearch.toLowerCase());
  });

  return (
    <div id="admin-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Top Bar */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
              Boutique Management
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold">
              Le-one Jewelries Admin Portal
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-medium flex items-center gap-1 text-neutral-300"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B8860B] text-neutral-950 rounded-lg text-xs font-bold uppercase tracking-wider"
          >
            View Live Store
          </button>

          <button
            onClick={adminLogout}
            className="p-2 bg-neutral-800 hover:bg-rose-950 text-rose-400 rounded-lg text-xs font-medium flex items-center gap-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 overflow-x-auto">
        {[
          { id: 'analytics', label: 'Overview & Revenue', icon: TrendingUp },
          { id: 'products', label: `Jewelry Catalog (${products.length})`, icon: Package },
          { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingCart },
          { id: 'reviews', label: `Customer Reviews (${reviews.length})`, icon: Star },
          { id: 'coupons', label: `Discount Coupons (${coupons.length})`, icon: Tag },
          { id: 'payments', label: 'Payment & Bank Accounts', icon: Landmark },
          { id: 'settings', label: 'Store & Delivery Settings', icon: Settings }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4 text-[#D4AF37]" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Analytics & Metrics */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Sales Volume</span>
              <p className="font-serif text-3xl font-bold text-neutral-900">{formatNaira(analytics.totalRevenue || 0)}</p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Direct & Online orders
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Orders Placed</span>
              <p className="font-serif text-3xl font-bold text-neutral-900">{analytics.totalOrders || orders.length}</p>
              <p className="text-[11px] text-neutral-500">Abuja & Nationwide</p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Jewelry in Catalog</span>
              <p className="font-serif text-3xl font-bold text-[#B8860B]">{products.length}</p>
              <p className="text-[11px] text-neutral-500">{analytics.lowStockCount || 0} low stock items</p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Store Physical Status</span>
              <p className="font-serif text-xl font-bold text-emerald-700">Open (Aki Cube Mall)</p>
              <p className="text-[11px] text-neutral-500">9:00 AM – 8:00 PM Daily</p>
            </div>
          </div>

          {/* Quick Orders Snapshot */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-neutral-900">Recent Customer Orders</h3>
            <div className="divide-y divide-neutral-100">
              {orders.slice(0, 5).map(o => {
                const cName = o.customer?.fullName || o.customerName || 'Customer';
                const city = o.delivery?.address?.city || o.deliveryAddress?.city || (o.delivery?.method === 'store_pickup' || o.deliveryMethod === 'store_pickup' ? 'Store Pickup' : 'Abuja');
                const ordTot = o.total ?? o.totalAmount ?? 0;
                const ordSt = o.orderStatus || o.status || 'confirmed';
                return (
                  <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-neutral-900">{o.orderNumber || o.id}</span>
                      <span className="text-neutral-500 ml-2">{cName} ({city})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-neutral-900">{formatNaira(ordTot)}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                        {ordSt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Product Management */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search jewelry catalog..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
              />
            </div>

            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  price: 50000,
                  category: 'Necklaces',
                  description: '',
                  images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
                  stock: 10,
                  material: '18K Gold Plated Brass',
                  sku: `LEONE-${Date.now().toString().slice(-4)}`,
                  rating: 5.0,
                  reviewCount: 0,
                  isFeatured: true
                });
                setProductModalOpen(true);
              }}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Jewelry Piece</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-200">
                  <tr>
                    <th className="p-4">Piece</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Badges</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-neutral-50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg border" />
                        <div>
                          <p className="font-semibold text-neutral-900">{p.name}</p>
                          <p className="text-[11px] text-neutral-400 font-mono">SKU: {p.sku}</p>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-600">{p.category}</td>
                      <td className="p-4 font-bold text-neutral-900">{formatNaira(p.price)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          p.stock > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {p.isNewArrival && <span className="px-1.5 py-0.5 bg-neutral-900 text-[#D4AF37] text-[10px] rounded">New</span>}
                          {p.isBestSeller && <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] rounded">Best</span>}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProductModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-bold uppercase">Filter Status:</span>
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  orderStatusFilter === st ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs divide-y divide-neutral-200">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">No orders matching this status filter.</div>
            ) : (
              filteredOrders.map(order => {
                const cName = order.customer?.fullName || order.customerName || 'Customer';
                const cPhone = order.customer?.phone || order.customerPhone || '+234 802 335 5789';
                const cEmail = order.customer?.email || order.customerEmail || '';
                const totalVal = order.total ?? order.totalAmount ?? 0;
                const currentStatus = order.orderStatus || order.status || 'confirmed';
                const orderNum = order.orderNumber || order.id;

                const dest = order.delivery?.address
                  ? `${order.delivery.address.street || order.delivery.address.address || ''}, ${order.delivery.address.city || 'Abuja'}, ${order.delivery.address.state || 'FCT'}`
                  : order.deliveryAddress
                  ? `${order.deliveryAddress.street || order.deliveryAddress.address || ''}, ${order.deliveryAddress.city || 'Abuja'}, ${order.deliveryAddress.state || 'FCT'}`
                  : order.delivery?.methodName || (order.deliveryMethod === 'store_pickup' ? 'Store Pickup: Aki Cube Mall, Gwarinpa' : 'Abuja Delivery');

                const methodStr = order.delivery?.methodName || order.deliveryMethod || 'Standard Delivery';
                const payMethod = (order.paymentMethod || 'paystack').toUpperCase();

                return (
                  <div key={order.id} className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-900 text-sm">{orderNum}</span>
                          <span className="text-neutral-400">•</span>
                          <span className="text-xs text-neutral-500">{formatDate(order.createdAt)}</span>
                        </div>
                        <p className="text-xs text-neutral-700 font-semibold mt-0.5">
                          {cName} ({cPhone}) {cEmail ? `• ${cEmail}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-serif text-lg font-bold text-[#B8860B]">
                          {formatNaira(totalVal)}
                        </span>

                        {/* Status Selector */}
                        <select
                          value={currentStatus}
                          onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-bold uppercase text-neutral-800"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {/* WhatsApp Direct Customer Chat */}
                        <a
                          href={getWhatsAppUrl(`Hello ${cName}, this is Le-one Jewelries Abuja regarding your Order #${orderNum}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1EBE5D]"
                          title="Chat with customer on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                        </a>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50 rounded-xl text-xs space-y-1">
                      <p><strong>Delivery Destination:</strong> {dest}</p>
                      <p><strong>Method / Payment:</strong> {methodStr} • {payMethod}</p>
                      {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Review Moderation */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs divide-y divide-neutral-100">
            {reviews.map(rev => (
              <div key={rev.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">{rev.customerName}</span>
                    <span className="text-neutral-400">({rev.customerLocation || 'Abuja'})</span>
                    <span className="text-amber-500 font-bold">★ {rev.rating}/5</span>
                  </div>
                  {rev.title && <p className="font-bold text-neutral-800">"{rev.title}"</p>}
                  <p className="text-neutral-600 italic">"{rev.comment}"</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleReviewApproval(rev.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                      rev.isVerified
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {rev.isVerified ? 'Verified Review ✓' : 'Approve & Verify'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Coupons */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-neutral-900">Active Discount Promo Codes</h3>
            <button
              onClick={() => setCouponModalOpen(true)}
              className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#B8860B]"
            >
              + Create New Coupon
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coupons.map(c => (
              <div key={c.code} className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-base text-[#B8860B]">{c.code}</span>
                  <button onClick={() => handleDeleteCoupon(c.code)} className="text-rose-600 hover:text-rose-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-neutral-700">
                  {c.discountType === 'percentage' ? `${c.discountValue}% Discount` : `${formatNaira(c.discountValue)} Off`}
                </p>
                <p className="text-[11px] text-neutral-400">Min Order: {formatNaira(c.minOrderAmount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Payment & Bank Accounts Configuration */}
      {activeTab === 'payments' && settings && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/70 border border-amber-200/80 p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#B8860B] flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">Payment Receiving & Bank Transfer Settings</h3>
                <p className="text-xs text-neutral-600">
                  Configure the official Nigerian bank account details where customers will transfer funds during checkout.
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveSettings}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Payment Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-6 text-xs">
                
                {/* Primary Bank Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="font-bold text-neutral-900 uppercase tracking-wider text-xs flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#B8860B]" />
                      Primary Receiving Bank Account (Active)
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      Displayed At Checkout
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">
                      Bank Name *
                    </label>
                    <div className="space-y-2">
                      <select
                        value={
                          POPULAR_NIGERIAN_BANKS.includes(settings.bankDetails?.bankName || '')
                            ? settings.bankDetails?.bankName
                            : 'Other / Custom Bank'
                        }
                        onChange={e => {
                          const val = e.target.value;
                          if (val !== 'Other / Custom Bank') {
                            setSettings({
                              ...settings,
                              bankDetails: {
                                ...settings.bankDetails,
                                bankName: val
                              }
                            });
                          }
                        }}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                      >
                        {POPULAR_NIGERIAN_BANKS.map(bank => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        required
                        placeholder="Or enter custom bank name (e.g. Zenith Bank Plc)"
                        value={settings.bankDetails?.bankName || ''}
                        onChange={e => setSettings({
                          ...settings,
                          bankDetails: {
                            ...settings.bankDetails,
                            bankName: e.target.value
                          }
                        })}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-neutral-700 uppercase mb-1">
                        10-Digit NUBAN Account Number *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={12}
                        placeholder="e.g. 0812345678"
                        value={settings.bankDetails?.accountNumber || ''}
                        onChange={e => setSettings({
                          ...settings,
                          bankDetails: {
                            ...settings.bankDetails,
                            accountNumber: e.target.value.replace(/[^0-9]/g, '')
                          }
                        })}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 uppercase mb-1">
                        Account / Beneficiary Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Le-one Jewelries Ltd"
                        value={settings.bankDetails?.accountName || ''}
                        onChange={e => setSettings({
                          ...settings,
                          bankDetails: {
                            ...settings.bankDetails,
                            accountName: e.target.value
                          }
                        })}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">
                      Payment Instructions & Transfer Narration Guidance
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Please use your Full Name or Order ID as payment narration. After transferring, send confirmation receipt on WhatsApp for express dispatch."
                      value={settings.bankDetails?.paymentInstructions || ''}
                      onChange={e => setSettings({
                        ...settings,
                        bankDetails: {
                          ...settings.bankDetails,
                          paymentInstructions: e.target.value
                        }
                      })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">
                      This custom message is presented to customers directly beneath the bank account number during checkout.
                    </p>
                  </div>
                </div>

                {/* Secondary / Mobile Money Account (Optional) */}
                <div className="pt-4 border-t border-neutral-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-900 uppercase tracking-wider text-xs">
                        Secondary Account / Mobile Money (Optional)
                      </span>
                      <p className="text-[11px] text-neutral-500">Provide an alternate option like OPay, Palmpay, or Zenith Bank</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSecondaryBank(!showSecondaryBank)}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold"
                    >
                      {showSecondaryBank ? 'Hide Secondary' : 'Configure Alternate'}
                    </button>
                  </div>

                  {showSecondaryBank && (
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                      <div>
                        <label className="block font-bold text-neutral-700 uppercase mb-1">Secondary Bank Name</label>
                        <input
                          type="text"
                          placeholder="e.g. OPay / Zenith Bank / Palmpay"
                          value={settings.bankDetails?.secondaryBankName || ''}
                          onChange={e => setSettings({
                            ...settings,
                            bankDetails: {
                              ...settings.bankDetails,
                              secondaryBankName: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-neutral-700 uppercase mb-1">Secondary Account Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 7012345678"
                            value={settings.bankDetails?.secondaryAccountNumber || ''}
                            onChange={e => setSettings({
                              ...settings,
                              bankDetails: {
                                ...settings.bankDetails,
                                secondaryAccountNumber: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-neutral-700 uppercase mb-1">Secondary Account Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Le-one Jewelries Abuja"
                            value={settings.bankDetails?.secondaryAccountName || ''}
                            onChange={e => setSettings({
                              ...settings,
                              bankDetails: {
                                ...settings.bankDetails,
                                secondaryAccountName: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-neutral-900 hover:bg-[#B8860B] text-white font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Payment Details & Bank Accounts</span>
                </button>
              </form>
            </div>

            {/* Right Column: Live Interactive Buyer Preview */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-bold text-xs uppercase tracking-wider text-[#D4AF37]">
                      Live Checkout Preview
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400">Customer View</span>
                </div>

                <p className="text-xs text-neutral-300">
                  This is the exact account box your customers will see on the checkout screen and order confirmation modal:
                </p>

                {/* Mock Checkout Card */}
                <div className="p-4 rounded-xl border border-amber-400/40 bg-amber-50/10 backdrop-blur-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Building className="w-4 h-4 text-[#D4AF37]" />
                      <div>
                        <p className="text-xs font-bold text-white">Direct Bank Transfer</p>
                        <p className="text-[10px] text-neutral-400">Instant verification via Nigerian corporate account</p>
                      </div>
                    </div>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#D4AF37]" />
                  </div>

                  <div className="pt-3 border-t border-white/10 bg-black/40 p-3 rounded-lg text-xs space-y-2 text-neutral-200">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Bank:</span>
                      <strong className="text-white font-semibold">
                        {settings.bankDetails?.bankName || 'Guaranty Trust Bank (GTBank)'}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Account Name:</span>
                      <strong className="text-white font-semibold">
                        {settings.bankDetails?.accountName || 'Le-one Jewelries Ltd'}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Account Number:</span>
                      <div className="flex items-center gap-2 font-mono font-bold text-[#D4AF37] text-sm">
                        <span>{settings.bankDetails?.accountNumber || '0812345678'}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(settings.bankDetails?.accountNumber || '0812345678');
                              setCopiedTestAccount(true);
                              setTimeout(() => setCopiedTestAccount(false), 2000);
                            }
                          }}
                          className="p-1 hover:text-white transition-colors"
                          title="Test Copy"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {copiedTestAccount && (
                      <p className="text-[10px] text-emerald-400 font-semibold text-right">
                        ✓ Account copied to clipboard!
                      </p>
                    )}

                    {settings.bankDetails?.paymentInstructions && (
                      <div className="pt-2 border-t border-white/10 text-[10px] text-neutral-300 italic">
                        {settings.bankDetails.paymentInstructions}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Channels */}
                <div className="pt-2 space-y-2 text-xs">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Additional Supported Methods
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-neutral-800 rounded-lg border border-neutral-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>WhatsApp Checkout</span>
                    </div>
                    <div className="p-2.5 bg-neutral-800 rounded-lg border border-neutral-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>In-Store Pickup</span>
                    </div>
                    <div className="p-2.5 bg-neutral-800 rounded-lg border border-neutral-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                      <span>Paystack Gateway</span>
                    </div>
                    <div className="p-2.5 bg-neutral-800 rounded-lg border border-neutral-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                      <span>Flutterwave Gateway</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs text-xs space-y-2">
                <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#B8860B]" />
                  Admin Tips for Instant Payment Reconciliation
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-neutral-600 text-[11px]">
                  <li>Ensure the Account Name matches the official corporate or personal name shown in Nigerian banking apps (NUBAN).</li>
                  <li>When orders are placed via transfer, customer receipts can be verified instantly by checking the "Customer Orders" tab.</li>
                  <li>Customers are encouraged to click "Send Order Confirmation on WhatsApp" to attach their payment slip directly to your phone.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Store & Delivery Settings */}
      {activeTab === 'settings' && settings && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">Boutique & Delivery Logistics</h3>
                <p className="text-xs text-neutral-500">
                  Manage store contact info, physical boutique address, and delivery fees.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('payments')}
                className="px-4 py-2 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-amber-100 transition-colors"
              >
                <Landmark className="w-4 h-4 text-[#B8860B]" />
                <span>Configure Payment & Bank Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Store Phone / WhatsApp Support *</label>
                  <input
                    type="text"
                    required
                    value={settings.phone || ''}
                    onChange={e => setSettings({ ...settings, phone: e.target.value, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Store Opening Hours *</label>
                  <input
                    type="text"
                    required
                    value={settings.openingHours || settings.businessHours || 'Monday–Sunday: 9:00 AM–8:00 PM'}
                    onChange={e => setSettings({ ...settings, openingHours: e.target.value, businessHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Physical Store Address (Aki Cube Mall, Gwarinpa) *</label>
                <input
                  type="text"
                  required
                  value={settings.address || ''}
                  onChange={e => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#B8860B]" />
                  Shipping & Courier Delivery Rates (₦)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">Abuja Standard (₦)</label>
                    <input
                      type="number"
                      value={settings.deliveryFees?.abujaStandard ?? settings.deliveryFees?.abuja_standard ?? 2500}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setSettings({
                          ...settings,
                          deliveryFees: {
                            ...settings.deliveryFees,
                            abujaStandard: val,
                            abuja_standard: val
                          }
                        });
                      }}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">Abuja Express (₦)</label>
                    <input
                      type="number"
                      value={settings.deliveryFees?.abujaExpress ?? settings.deliveryFees?.abuja_express ?? 4500}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setSettings({
                          ...settings,
                          deliveryFees: {
                            ...settings.deliveryFees,
                            abujaExpress: val,
                            abuja_express: val
                          }
                        });
                      }}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">Nationwide Shipping (₦)</label>
                    <input
                      type="number"
                      value={settings.deliveryFees?.nationwide ?? settings.deliveryFees?.nationwide_shipping ?? 5500}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setSettings({
                          ...settings,
                          deliveryFees: {
                            ...settings.deliveryFees,
                            nationwide: val,
                            nationwide_shipping: val
                          }
                        });
                      }}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">Free Delivery Over (₦)</label>
                    <input
                      type="number"
                      value={settings.deliveryFees?.freeDeliveryThreshold ?? settings.deliveryFees?.free_delivery_threshold ?? 150000}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setSettings({
                          ...settings,
                          deliveryFees: {
                            ...settings.deliveryFees,
                            freeDeliveryThreshold: val,
                            free_delivery_threshold: val
                          }
                        });
                      }}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-3 bg-neutral-900 hover:bg-[#B8860B] text-white font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Edit/Add Modal */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-lg font-bold text-neutral-900">
                {editingProduct.id ? 'Edit Jewelry Piece' : 'Add New Jewelry Piece'}
              </h3>
              <button onClick={() => setProductModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Price (₦) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Original Price (₦, if discounted)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'Necklaces'}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.images?.[0] || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProduct.isNewArrival}
                    onChange={e => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                  />
                  <span>Mark as New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProduct.isBestSeller}
                    onChange={e => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-neutral-900 hover:bg-[#B8860B] text-white rounded-xl font-bold"
                >
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold">Create Promo Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block font-bold uppercase mb-1">Coupon Code (e.g. ABUJA10)</label>
                <input
                  type="text"
                  required
                  placeholder="CODE"
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border rounded-xl uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase mb-1">Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Naira (₦)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountValue}
                    onChange={e => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setCouponModalOpen(false)} className="flex-1 py-2 bg-neutral-100 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-neutral-900 text-white rounded-xl font-bold">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
