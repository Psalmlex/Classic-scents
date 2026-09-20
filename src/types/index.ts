export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: string;
  tags: string[]; // e.g. 'featured', 'new_arrival', 'best_seller', 'on_sale'
  images: string[];
  description: string;
  specifications: Record<string, string>;
  materials: string[];
  variations?: {
    name: string;
    options: string[];
  }[];
  stock: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  isDemo?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  itemCount?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedVariations?: Record<string, string>;
  product: Product;
}

export type DeliveryMethod = 'abuja_standard' | 'abuja_express' | 'nationwide' | 'store_pickup';

export interface DeliveryOption {
  id: DeliveryMethod;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
}

export type PaymentMethod = 'paystack' | 'flutterwave' | 'bank_transfer' | 'store_payment';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedVariations?: Record<string, string>;
  product?: {
    id?: string;
    name?: string;
    price?: number;
    images?: string[];
  };
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
}

export interface DeliveryAddress {
  state: string;
  city: string;
  address: string;
  street?: string;
  country?: string;
  postalCode?: string;
  deliveryNotes?: string;
  additionalInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. LEO-2026-0001
  customer: CustomerInfo;
  delivery: {
    method: DeliveryMethod;
    methodName: string;
    fee: number;
    address?: DeliveryAddress;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Compatibility fields
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerWhatsapp?: string;
  deliveryAddress?: DeliveryAddress;
  deliveryMethod?: DeliveryMethod;
  totalAmount?: number;
  deliveryFee?: number;
  discountAmount?: number;
  status?: OrderStatus;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  customerName: string;
  customerLocation?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerified: boolean;
  isApproved: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number; // e.g. 10 for 10% or 5000 for ₦5,000
  minOrder: number;
  expiresAt: string;
  isActive: boolean;
  usageCount: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  mallName: string;
  businessHours: string;
  openingHours?: string;
  googleRating: number;
  googleReviewCount: number;
  googleMapsUrl: string;
  deliveryFees: {
    abujaStandard: number;
    abujaExpress: number;
    nationwide: number;
    freeDeliveryThreshold: number;
    abuja_standard?: number;
    abuja_express?: number;
    nationwide_shipping?: number;
    free_delivery_threshold?: number;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    paymentInstructions?: string;
    secondaryBankName?: string;
    secondaryAccountNumber?: string;
    secondaryAccountName?: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  announcement: string;
  heroHeadline: string;
  heroSubheadline: string;
  allowGuestCheckout: boolean;
  enableReviews: boolean;
  currency: string;
  currencySymbol: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  whatsapp?: string;
  addresses: DeliveryAddress[];
  wishlist: string[]; // product IDs
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  topSellingProducts: {
    id: string;
    name: string;
    image: string;
    price: number;
    salesCount: number;
    revenue: number;
  }[];
  recentOrders: Order[];
}
