import React, { useState, useEffect } from 'react';
import {
  Shield, Package, ShoppingCart, Tag, Star, Settings, Plus, Edit, Trash2,
  Check, X, AlertCircle, RefreshCw, MessageCircle, DollarSign, TrendingUp,
  Eye, EyeOff, LogOut, Search, Filter, Save, Landmark, CreditCard, Copy,
  CheckCircle2, Building, Wallet, ExternalLink, ArrowRight, FolderTree, Sparkles, Layers,
  Lock, Key
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
  const [isAuthenticating, setIsAuthenticating] = useState(false);
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
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  // Category Edit/Add Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

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
    if (!passwordInput.trim()) return;
    setAuthError('');
    setIsAuthenticating(true);
    try {
      const res = await adminLogin(passwordInput.trim());
      if (!res.success) {
        setAuthError(res.error || 'Access Denied: The provided key does not match the configured ADMIN_SECRET_KEY.');
      } else {
        setPasswordInput('');
      }
    } catch (err) {
      setAuthError('Authentication verification failed. Please check your network connection.');
    } finally {
      setIsAuthenticating(false);
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

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name?.trim()) return;
    const key = adminKey || '';
    try {
      if (editingCategory.id) {
        await apiService.updateCategory(editingCategory.id, editingCategory, key);
        setActionMsg(`Category "${editingCategory.name}" updated successfully!`);
      } else {
        await apiService.createCategory(editingCategory, key);
        setActionMsg(`New category "${editingCategory.name}" created!`);
      }
      setCategoryModalOpen(false);
      setEditingCategory(null);
      loadAdminData();
      onRefreshData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? Products in this category will not be deleted.`)) return;
    const key = adminKey || '';
    try {
      await apiService.deleteCategory(id, key);
      setActionMsg(`Category "${name}" deleted.`);
      loadAdminData();
      onRefreshData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickAddCategory = async (preset: { name: string; image: string; description: string }) => {
    const key = adminKey || '';
    try {
      await apiService.createCategory(preset, key);
      setActionMsg(`Category "${preset.name}" added to boutique!`);
      loadAdminData();
      onRefreshData();
      setTimeout(() => setActionMsg(''), 3000);
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

  // If not authenticated as admin, show password-protected overlay login gate
  if (!isAdmin) {
    return (
      <div
        id="admin-overlay-login-gate"
        className="fixed inset-0 z-[100] bg-neutral-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto min-h-screen text-neutral-100"
      >
        <div className="w-full max-w-md my-auto relative">
          {/* Ambient Gold Glow Backdrop */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 via-amber-500/10 to-[#D4AF37]/20 rounded-3xl blur-xl opacity-60 pointer-events-none" />

          {/* Gate Card */}
          <div className="relative bg-[#121212] border border-neutral-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center backdrop-blur-sm">
            {/* Top gold accent gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-t-2xl" />

            {/* Emblem */}
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-neutral-950 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shadow-xl shadow-black/60">
              <Lock className="w-7 h-7 text-[#D4AF37]" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-neutral-950"></span>
              </span>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono uppercase tracking-wider">
                <Shield className="w-3 h-3 text-[#D4AF37]" />
                Restricted Admin Gate
              </div>
              <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
                Le-one Administrator Gate
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
                Enter the master <code className="px-1.5 py-0.5 bg-neutral-800 text-[#D4AF37] font-mono text-[11px] rounded border border-neutral-700">ADMIN_SECRET_KEY</code> configured in your environment to decrypt and access management controls.
              </p>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Secret Key / Master Password</span>
                  <span className="text-[10px] text-neutral-400 font-mono lowercase">env: ADMIN_SECRET_KEY</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                    <Key className="w-4 h-4 text-[#D4AF37]/80" />
                  </div>
                  <input
                    id="admin-secret-key-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter ADMIN_SECRET_KEY"
                    value={passwordInput}
                    onChange={e => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    className="w-full pl-10 pr-10 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-rose-300">Access Denied</p>
                    <p className="text-neutral-300 text-[11px] leading-relaxed">{authError}</p>
                  </div>
                </div>
              )}

              <button
                id="admin-gate-submit-btn"
                type="submit"
                disabled={isAuthenticating || !passwordInput.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#f3d37a] to-[#B8860B] hover:opacity-95 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
                    <span>Verifying Environment Key...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-neutral-950" />
                    <span>Unlock Administrator Console</span>
                    <ArrowRight className="w-4 h-4 text-neutral-950" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <button
                type="button"
                onClick={onExitAdmin}
                className="hover:text-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>← Return to Public Boutique</span>
              </button>
              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#D4AF37]" /> TLS Encrypted
              </span>
            </div>
          </div>
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
    const name = p.name || '';
    const category = p.category || '';
    const sku = p.sku || '';
    const matchesSearch = !productSearch || 
      name.toLowerCase().includes(productSearch.toLowerCase()) || 
      category.toLowerCase().includes(productSearch.toLowerCase()) ||
      sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || category.toLowerCase() === productCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Filtered categories
  const filteredCategories = (categories || []).filter(c => {
    if (!c) return false;
    if (!categorySearch) return true;
    return (c.name || '').toLowerCase().includes(categorySearch.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(categorySearch.toLowerCase());
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
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-950/50 border border-emerald-500/30 rounded-full text-[11px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ADMIN_SECRET_KEY: ACTIVE</span>
          </div>

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
            id="admin-lock-portal-action-btn"
            onClick={() => {
              adminLogout();
              setPasswordInput('');
            }}
            className="px-3.5 py-2 bg-neutral-800 hover:bg-rose-950/70 border border-neutral-700/80 hover:border-rose-700/60 text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Lock Portal & Require Secret Key"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Lock Portal</span>
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
          { id: 'products', label: `Products Catalog (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree },
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
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Products in Catalog</span>
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <div className="relative max-w-sm flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, category, SKU..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase text-neutral-400 tracking-wider">Category:</span>
                <select
                  value={productCategoryFilter}
                  onChange={e => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-neutral-800"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map(c => {
                    const count = products.filter(p => (p.category || '').toLowerCase() === c.name.toLowerCase()).length;
                    return (
                      <option key={c.id} value={c.name}>
                        {c.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  price: 50000,
                  category: categories[0]?.name || 'Perfumes & Fragrances',
                  description: '',
                  images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'],
                  stock: 10,
                  material: '',
                  sku: `LEO-${Date.now().toString().slice(-4)}`,
                  rating: 5.0,
                  reviewCount: 0,
                  isFeatured: true
                });
                setIsCustomCategoryMode(false);
                setCustomCategoryName('');
                setProductModalOpen(true);
              }}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 self-start lg:self-auto transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
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

      {/* TAB: Categories Management */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Header & Create Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                Product Categories & Departments ({categories.length})
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
                Organize your boutique into product lines. Add perfumes, luxury bags, watches, jewelry, cosmetics, footwear, or any new future category.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingCategory({
                  name: '',
                  description: '',
                  image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'
                });
                setCategoryModalOpen(true);
              }}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 self-start sm:self-auto transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Category</span>
            </button>
          </div>

          {/* Quick-Add Presets Banner */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-[#B8860B]" />
              <span>1-Click Popular Category Presets</span>
              <span className="text-[11px] font-normal text-amber-800/80">(Click any department to instantly add it to your boutique)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  name: 'Perfumes & Fragrances',
                  image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
                  description: 'Niche Arabian ouds, French florals, luxury extraits de parfum, and signature scents.'
                },
                {
                  name: 'Luxury Bags & Clutches',
                  image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
                  description: 'Handcrafted leather tote bags, evening crystal clutches, and designer accessories.'
                },
                {
                  name: 'Designer Watches',
                  image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
                  description: 'Luxury timepieces for men and women with stainless steel and leather straps.'
                },
                {
                  name: 'Beauty & Cosmetics',
                  image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
                  description: 'Premium skincare, hydrating serums, makeup, and radiant beauty essentials.'
                },
                {
                  name: 'Luxury Footwear',
                  image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
                  description: 'Handmade Italian leather heels, loafers, and designer footwear.'
                },
                {
                  name: 'Sunglasses & Eyewear',
                  image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
                  description: 'UV-protected polarized designer sunglasses and luxury eyewear frames.'
                }
              ].map(preset => {
                const alreadyAdded = categories.some(c => c.name.toLowerCase() === preset.name.toLowerCase());
                return (
                  <button
                    key={preset.name}
                    disabled={alreadyAdded}
                    onClick={() => handleQuickAddCategory(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      alreadyAdded
                        ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
                        : 'bg-white text-neutral-800 border border-amber-200 hover:border-[#B8860B] hover:text-[#B8860B] shadow-xs'
                    }`}
                  >
                    <span>{alreadyAdded ? '✓' : '+'}</span>
                    <span>{preset.name}</span>
                    {alreadyAdded && <span className="text-[10px] text-neutral-400 font-normal">(Added)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Category */}
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search categories by name..."
              value={categorySearch}
              onChange={e => setCategorySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
            />
          </div>

          {/* Categories Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(cat => {
              const liveCount = products.filter(p => (p.category || '').toLowerCase() === cat.name.toLowerCase()).length;
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-neutral-100">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.src = 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
                        {liveCount} {liveCount === 1 ? 'Product' : 'Products'}
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-base font-bold text-neutral-900">{cat.name}</h4>
                        <span className="font-mono text-[10px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                          /{cat.slug}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 line-clamp-2">
                        {cat.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setProductCategoryFilter(cat.name);
                        setActiveTab('products' as any);
                      }}
                      className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>View Products ({liveCount})</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setCategoryModalOpen(true);
                        }}
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-lg transition-colors"
                        title="Edit category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-neutral-700 uppercase">Category</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategoryMode(!isCustomCategoryMode);
                        if (!isCustomCategoryMode) {
                          setCustomCategoryName('');
                        }
                      }}
                      className="text-[11px] text-[#B8860B] font-bold hover:underline"
                    >
                      {isCustomCategoryMode ? '← Pick Existing' : '+ New Category'}
                    </button>
                  </div>
                  {isCustomCategoryMode ? (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Perfumes, Luxury Bags..."
                      value={customCategoryName}
                      onChange={e => {
                        setCustomCategoryName(e.target.value);
                        setEditingProduct({ ...editingProduct, category: e.target.value });
                      }}
                      className="w-full px-3 py-2 border border-amber-300 bg-amber-50/40 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#B8860B]"
                    />
                  ) : (
                    <select
                      value={editingProduct.category || categories[0]?.name || 'Perfumes & Fragrances'}
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    >
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  )}
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
                  Save Product
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

      {/* Category Add/Edit Modal */}
      {categoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-5 text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  {editingCategory.id ? 'Edit Boutique Category' : 'Create New Product Category'}
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Set up a department (e.g. Perfumes & Fragrances, Luxury Bags, Watches, Skincare)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">
                  Category Department Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Perfumes & Fragrances, Designer Bags, Fine Watches..."
                  value={editingCategory.name || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short overview describing this collection to customers..."
                  value={editingCategory.description || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">
                  Cover / Banner Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={editingCategory.image || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, image: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs"
                />

                {/* Quick image preset chips */}
                <div className="mt-2 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Quick Image Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: '🧴 Perfumes', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80' },
                      { label: '👜 Luxury Bags', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' },
                      { label: '⌚ Watches', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80' },
                      { label: '💄 Cosmetics', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80' },
                      { label: '✨ Jewelry', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
                      { label: '👞 Footwear', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' }
                    ].map(p => (
                      <button
                        type="button"
                        key={p.label}
                        onClick={() => setEditingCategory({ ...editingCategory, image: p.url })}
                        className="px-2 py-1 bg-neutral-100 hover:bg-amber-100 hover:text-amber-900 text-neutral-600 rounded text-[10px] font-medium transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Preview */}
                {editingCategory.image && (
                  <div className="mt-3 relative h-28 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                    <img
                      src={editingCategory.image}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white font-serif font-bold text-sm">
                        {editingCategory.name || 'Category Preview'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-neutral-900 hover:bg-[#B8860B] text-white rounded-xl font-bold transition-colors shadow-xs"
                >
                  {editingCategory.id ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
