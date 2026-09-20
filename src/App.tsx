import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext.tsx';
import { WishlistProvider } from './context/WishlistContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

// Layout
import { AnnouncementBar } from './components/layout/AnnouncementBar.tsx';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';

// Modals & Common
import { CartDrawer } from './components/cart/CartDrawer.tsx';
import { QuickViewModal } from './components/common/QuickViewModal.tsx';
import { WhatsAppButton } from './components/common/WhatsAppButton.tsx';

// Home Sections
import { HeroSection } from './components/home/HeroSection.tsx';
import { TrustSection } from './components/home/TrustSection.tsx';
import { CategoryShowcase } from './components/home/CategoryShowcase.tsx';
import { FeaturedProducts } from './components/home/FeaturedProducts.tsx';
import { StoreLocationSection } from './components/home/StoreLocationSection.tsx';
import { ReviewsSection } from './components/home/ReviewsSection.tsx';

// Pages
import { ShopPage } from './components/shop/ShopPage.tsx';
import { ProductDetailPage } from './components/product/ProductDetailPage.tsx';
import { CartPage } from './components/cart/CartPage.tsx';
import { CheckoutPage } from './components/checkout/CheckoutPage.tsx';
import { WishlistPage } from './components/account/WishlistPage.tsx';
import { AccountPage } from './components/account/AccountPage.tsx';
import { AboutPage } from './components/pages/AboutPage.tsx';
import { ContactPage } from './components/pages/ContactPage.tsx';
import { FaqPage } from './components/pages/FaqPage.tsx';
import { DeliveryPage } from './components/pages/DeliveryPage.tsx';
import { PolicyPage } from './components/pages/PolicyPage.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';

// API & Types
import { apiService } from './services/api.ts';
import { Product, Category, Review } from './types/index.ts';

export type PageView =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'wishlist'
  | 'account'
  | 'about'
  | 'contact'
  | 'faq'
  | 'delivery'
  | 'policies'
  | 'admin';

export const App: React.FC = () => {
  const getInitialPage = (): PageView => {
    try {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#admin' || hash.startsWith('#admin') || path === '/admin' || path.startsWith('/admin') || search.includes('admin') || search.includes('page=admin')) {
        return 'admin';
      }
    } catch {}
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageView>(getInitialPage);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart Drawer & Modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [policyInitialTab, setPolicyInitialTab] = useState<'returns' | 'privacy' | 'terms'>('returns');

  // Global Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch initial catalog data
  const fetchData = async () => {
    try {
      const [prodRes, catRes, revRes] = await Promise.all([
        apiService.getProducts({ limit: 100 }),
        apiService.getCategories(),
        apiService.getReviews()
      ]);
      setProducts(prodRes.products);
      setCategories(catRes);
      setReviews(revRes.reviews);
    } catch (err) {
      console.error('Error loading store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Listen for direct URL navigation (#admin, popstate, etc.)
  useEffect(() => {
    const handleLocationChange = () => {
      try {
        const hash = window.location.hash.toLowerCase();
        const path = window.location.pathname.toLowerCase();
        const search = window.location.search.toLowerCase();
        if (hash === '#admin' || hash.startsWith('#admin') || path === '/admin' || path.startsWith('/admin') || search.includes('admin') || search.includes('page=admin')) {
          setCurrentPage('admin');
        }
      } catch {}
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedProductId]);

  // Navigation handlers
  const handleNavigate = (page: PageView, category: string = 'all') => {
    if (page === 'admin') {
      window.location.hash = 'admin';
    } else if (window.location.hash === '#admin') {
      try {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      } catch {}
    }
    setSelectedCategory(category);
    setCurrentPage(page);
  };

  const handleExitAdmin = () => {
    try {
      if (window.location.hash === '#admin') {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      }
    } catch {}
    setCurrentPage('home');
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('shop');
  };

  const handleOpenPolicies = (tab: 'returns' | 'privacy' | 'terms') => {
    setPolicyInitialTab(tab);
    setCurrentPage('policies');
  };

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // If in dedicated admin mode, render standalone personal page
  if (currentPage === 'admin') {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-[#D4AF37]/30 selection:text-white">
          <main className="py-6 sm:py-10">
            <AdminDashboard
              onExitAdmin={handleExitAdmin}
              onRefreshData={fetchData}
            />
          </main>
        </div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider onOpenCart={() => setIsCartDrawerOpen(true)}>
          <div className="min-h-screen flex flex-col bg-[#FCFBF8] text-neutral-900 font-sans selection:bg-[#D4AF37]/30 selection:text-neutral-950">
            
            {/* Top Announcement Bar */}
            <AnnouncementBar onTrackOrderClick={() => setCurrentPage('account')} />

            {/* Sticky Header Navigation */}
            <Header
              currentPage={currentPage}
              onNavigate={handleNavigate}
              onOpenCart={() => setIsCartDrawerOpen(true)}
              onSearch={handleSearch}
              onSelectCategory={(cat) => handleNavigate('shop', cat)}
            />

            {/* Main Content Router */}
            <main className="flex-1">
              
              {/* PAGE: HOME */}
              {currentPage === 'home' && (
                <div className="space-y-16 sm:space-y-24 pb-16 sm:pb-24">
                  <HeroSection
                    onExploreCollection={() => handleNavigate('shop', 'all')}
                    onVisitBoutique={() => setCurrentPage('contact')}
                  />

                  <TrustSection />

                  <CategoryShowcase
                    categories={categories}
                    onSelectCategory={(catName) => handleNavigate('shop', catName)}
                  />

                  <FeaturedProducts
                    products={products}
                    onViewDetails={handleSelectProduct}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onViewAll={() => handleNavigate('shop', 'all')}
                  />

                  <StoreLocationSection
                    onGetDirections={() => setCurrentPage('contact')}
                  />

                  <ReviewsSection
                    reviews={reviews}
                    googleRating={4.7}
                    googleReviewCount={6}
                    onReviewAdded={fetchData}
                    onNewReviewAdded={fetchData}
                  />
                </div>
              )}

              {/* PAGE: SHOP / CATALOG */}
              {currentPage === 'shop' && (
                <ShopPage
                  products={products}
                  categories={categories}
                  initialCategory={selectedCategory}
                  initialSearch={searchQuery}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onViewDetails={handleSelectProduct}
                />
              )}

              {/* PAGE: PRODUCT DETAIL */}
              {currentPage === 'product' && (
                <ProductDetailPage
                  productId={selectedProductId}
                  product={selectedProduct}
                  allProducts={products}
                  onBack={() => handleNavigate('shop', 'all')}
                  onSelectRelated={handleSelectProduct}
                  onNavigateProduct={handleSelectProduct}
                  onBuyNow={() => setCurrentPage('checkout')}
                  onCheckoutDirect={() => setCurrentPage('checkout')}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              )}

              {/* PAGE: CART */}
              {currentPage === 'cart' && (
                <CartPage
                  onProceedToCheckout={() => setCurrentPage('checkout')}
                  onContinueShopping={() => handleNavigate('shop', 'all')}
                />
              )}

              {/* PAGE: CHECKOUT */}
              {currentPage === 'checkout' && (
                <CheckoutPage
                  onBackToCart={() => setCurrentPage('cart')}
                  onContinueShopping={() => handleNavigate('shop', 'all')}
                />
              )}

              {/* PAGE: WISHLIST */}
              {currentPage === 'wishlist' && (
                <WishlistPage
                  allProducts={products}
                  onContinueShopping={() => handleNavigate('shop', 'all')}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onViewDetails={handleSelectProduct}
                />
              )}

              {/* PAGE: ACCOUNT & TRACKING */}
              {currentPage === 'account' && (
                <AccountPage
                  onNavigateToShop={() => handleNavigate('shop', 'all')}
                />
              )}

              {/* PAGE: ABOUT */}
              {currentPage === 'about' && (
                <AboutPage
                  onShopClick={() => handleNavigate('shop', 'all')}
                  onContactClick={() => setCurrentPage('contact')}
                />
              )}

              {/* PAGE: CONTACT */}
              {currentPage === 'contact' && <ContactPage />}

              {/* PAGE: FAQ */}
              {currentPage === 'faq' && <FaqPage />}

              {/* PAGE: DELIVERY */}
              {currentPage === 'delivery' && (
                <DeliveryPage onShopClick={() => handleNavigate('shop', 'all')} />
              )}

              {/* PAGE: POLICIES */}
              {currentPage === 'policies' && (
                <PolicyPage initialTab={policyInitialTab} />
              )}

            </main>

            {/* Site Footer */}
            <Footer
              onNavigate={handleNavigate}
              onOpenPolicies={handleOpenPolicies}
            />

            {/* Global Slide-Out Cart Drawer */}
            <CartDrawer
              isOpen={isCartDrawerOpen}
              onClose={() => setIsCartDrawerOpen(false)}
              onCheckout={() => {
                setIsCartDrawerOpen(false);
                setCurrentPage('checkout');
              }}
              onViewCart={() => {
                setIsCartDrawerOpen(false);
                setCurrentPage('cart');
              }}
            />

            {/* Quick View Modal */}
            {quickViewProduct && (
              <QuickViewModal
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onViewFullDetails={() => {
                  const pid = quickViewProduct.id;
                  setQuickViewProduct(null);
                  handleSelectProduct(pid);
                }}
              />
            )}

            {/* Floating WhatsApp Action Widget */}
            <WhatsAppButton />

          </div>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
};
export default App;
