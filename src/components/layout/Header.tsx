import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, MessageCircle, Gem, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { getWhatsAppUrl, formatNaira } from '../../utils/formatters.ts';
import { Product } from '../../types/index.ts';
import { apiService } from '../../services/api.ts';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, payload?: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await apiService.getProducts({ search: searchQuery, limit: 5 });
        setSearchResults(res.products);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', { search: searchQuery.trim() });
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Shop All', view: 'shop' },
    { label: 'Collections', view: 'collections' },
    { label: 'About Us', view: 'about' },
    { label: 'Visit Store & Contact', view: 'contact' },
    { label: 'Delivery & FAQ', view: 'faq' }
  ];

  return (
    <>
      <header
        id="main-header"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80 py-3'
            : 'bg-white border-b border-neutral-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-neutral-800 hover:text-[#B8860B] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <div
              id="brand-logo"
              onClick={() => onNavigate('home')}
              className="cursor-pointer flex flex-col items-center sm:items-start group select-none"
            >
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-[#D4AF37] transition-transform duration-300 group-hover:rotate-12" />
                <span className="font-serif text-xl sm:text-2xl tracking-[0.2em] font-bold text-neutral-900 group-hover:text-[#B8860B] transition-colors uppercase">
                  Le-One Jewelries
                </span>
              </div>
              <span className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase font-medium mt-0.5">
                Boutique • Abuja, Nigeria
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav id="desktop-nav" className="hidden lg:flex items-center space-x-7">
              {navLinks.map(link => {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.view}
                    onClick={() => onNavigate(link.view)}
                    className={`text-sm tracking-wider uppercase font-medium transition-colors py-1 relative ${
                      isActive
                        ? 'text-[#B8860B] font-semibold'
                        : 'text-neutral-700 hover:text-[#B8860B]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* WhatsApp Call to Action */}
              <a
                id="header-whatsapp-btn"
                href={getWhatsAppUrl('Hello Le-one Jewelries, I would like to make an inquiry.')}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all text-xs font-semibold border border-[#25D366]/30"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Search Toggle Button */}
              <button
                id="search-toggle-btn"
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  if (!searchOpen) {
                    setTimeout(() => searchInputRef.current?.focus(), 100);
                  }
                }}
                className="p-2 text-neutral-700 hover:text-[#B8860B] transition-colors rounded-full hover:bg-neutral-100"
                aria-label="Search jewelry"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account */}
              <button
                id="account-btn"
                onClick={() => onNavigate('account')}
                className="p-2 text-neutral-700 hover:text-[#B8860B] transition-colors rounded-full hover:bg-neutral-100 relative"
                aria-label="My Account"
                title={user ? `Account: ${user.fullName}` : 'Login / Account'}
              >
                <User className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button
                id="wishlist-header-btn"
                onClick={() => onNavigate('wishlist')}
                className="p-2 text-neutral-700 hover:text-[#B8860B] transition-colors rounded-full hover:bg-neutral-100 relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B8860B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag / Cart */}
              <button
                id="cart-header-btn"
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-2 p-2 bg-neutral-900 text-white hover:bg-[#B8860B] rounded-full sm:px-3.5 sm:py-2 transition-all shadow-xs"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-semibold tracking-wide">
                  Bag ({itemCount})
                </span>
                <span className="sm:hidden text-xs font-bold">{itemCount}</span>
              </button>
            </div>
          </div>

          {/* Search Bar Flyout */}
          {searchOpen && (
            <div id="search-flyout" className="mt-3 pt-3 border-t border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search gold necklaces, diamond rings, Cuban links, luxury watches..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all"
                />
                <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-3 py-1 bg-neutral-900 text-white text-xs font-medium rounded hover:bg-[#B8860B] transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Autocomplete Dropdown */}
              {searchQuery && (
                <div className="mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100 z-50">
                  {isSearching ? (
                    <div className="p-4 text-xs text-neutral-500 text-center">Searching catalog...</div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      <div className="px-3 py-2 bg-neutral-50 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                        Suggested Products
                      </div>
                      {searchResults.map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            onNavigate('product-detail', { productId: prod.id });
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-amber-50/50 cursor-pointer transition-colors"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded border border-neutral-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-neutral-900 truncate">{prod.name}</h4>
                            <p className="text-xs text-neutral-500">{prod.category}</p>
                          </div>
                          <div className="text-sm font-semibold text-[#B8860B]">
                            {formatNaira(prod.price)}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-center py-2 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-800 flex items-center justify-center gap-1"
                      >
                        View all results for "{searchQuery}" <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-xs text-neutral-500 text-center">
                      No products found for "{searchQuery}". Try searching for 'Necklace', 'Gold', or 'Watch'.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header inside drawer */}
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gem className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-serif font-bold text-base tracking-widest text-neutral-900">
                    LE-ONE JEWELRIES
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-1">
                {navLinks.map(link => (
                  <button
                    key={link.view}
                    onClick={() => {
                      onNavigate(link.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      currentView === link.view
                        ? 'bg-amber-50 text-[#B8860B] font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                <div className="pt-4 border-t border-neutral-100 mt-4 space-y-1">
                  <button
                    onClick={() => {
                      onNavigate('wishlist');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-neutral-500" />
                      Wishlist
                    </span>
                    {wishlistCount > 0 && (
                      <span className="bg-[#B8860B] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('account');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-neutral-500" />
                    {user ? `My Account (${user.fullName})` : 'Customer Sign In'}
                  </button>
                </div>
              </nav>
            </div>

            {/* Bottom info inside mobile drawer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 space-y-3">
              <a
                href={getWhatsAppUrl('Hello Le-one Jewelries, I am reaching out from your website.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1EBE5D] transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Chat on WhatsApp
              </a>

              <div className="text-[11px] text-neutral-500 text-center leading-relaxed">
                <p className="font-semibold text-neutral-800">Aki Cube Mall, Gwarinpa, Abuja</p>
                <p>Open Monday–Sunday: 9am–8pm</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
