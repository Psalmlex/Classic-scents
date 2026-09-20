import { Product, Category, Order, Review, Coupon, StoreSettings, AnalyticsSummary } from '../types/index.ts';

const API_BASE = '/api';

export const apiService = {
  // Store Settings
  async getSettings(): Promise<StoreSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<StoreSettings>, adminKey: string): Promise<{ success: boolean; settings: StoreSettings }> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createCategory(cat: Partial<Category>, adminKey: string): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify(cat)
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  async updateCategory(id: string, cat: Partial<Category>, adminKey: string): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify(cat)
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },

  async deleteCategory(id: string, adminKey: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': adminKey }
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return res.json();
  },

  // Products
  async getProducts(params?: {
    category?: string;
    tag?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
    includeInactive?: boolean;
  }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params) {
      if (params.category) query.append('category', params.category);
      if (params.tag) query.append('tag', params.tag);
      if (params.search) query.append('search', params.search);
      if (params.minPrice !== undefined) query.append('minPrice', String(params.minPrice));
      if (params.maxPrice !== undefined) query.append('maxPrice', String(params.maxPrice));
      if (params.inStock) query.append('inStock', 'true');
      if (params.sort) query.append('sort', params.sort);
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));
      if (params.includeInactive) query.append('includeInactive', 'true');
    }

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
    if (!res.ok) throw new Error('Failed to fetch product details');
    return res.json();
  },

  async createProduct(product: Partial<Product>, adminKey: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async updateProduct(id: string, product: Partial<Product>, adminKey: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async deleteProduct(id: string, adminKey: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': adminKey }
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  // Orders
  async createOrder(orderData: any): Promise<{ success: boolean; order: Order; whatsappOrderMessage: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to place order');
    }
    return res.json();
  },

  async getOrders(params: { email?: string; phone?: string; adminKey?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params.email) query.append('email', params.email);
    if (params.phone) query.append('phone', params.phone);
    if (params.adminKey) query.append('adminKey', params.adminKey);

    const headers: Record<string, string> = {};
    if (params.adminKey) {
      headers['x-admin-key'] = params.adminKey;
    }

    const res = await fetch(`${API_BASE}/orders?${query.toString()}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async getOrder(idOrNumber: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${idOrNumber}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  async updateOrderStatus(
    id: string,
    data: { orderStatus?: string; paymentStatus?: string; trackingNumber?: string; notes?: string },
    adminKey: string
  ): Promise<{ success: boolean; order: Order }> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  // Coupons
  async validateCoupon(code: string, cartSubtotal: number): Promise<{
    valid: boolean;
    coupon?: { code: string; type: 'percent' | 'fixed'; value: number; discountAmount: number };
    message?: string;
  }> {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartSubtotal })
    });
    return res.json();
  },

  async getCoupons(adminKey: string): Promise<Coupon[]> {
    const res = await fetch(`${API_BASE}/coupons`, {
      headers: { 'x-admin-key': adminKey }
    });
    if (!res.ok) throw new Error('Failed to fetch coupons');
    return res.json();
  },

  async createCoupon(coupon: Partial<Coupon>, adminKey: string): Promise<Coupon> {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify(coupon)
    });
    if (!res.ok) throw new Error('Failed to create coupon');
    return res.json();
  },

  async deleteCoupon(id: string, adminKey: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': adminKey }
    });
    if (!res.ok) throw new Error('Failed to delete coupon');
    return res.json();
  },

  // Reviews
  async getReviews(productId?: string, all?: boolean): Promise<{ googleRating: number; googleReviewCount: number; reviews: Review[] }> {
    const query = new URLSearchParams();
    if (productId) query.append('productId', productId);
    if (all) query.append('all', 'true');

    const res = await fetch(`${API_BASE}/reviews?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async submitReview(review: Partial<Review>): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  async toggleReviewApproval(id: string, adminKey: string): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews/${id}/approve`, {
      method: 'PATCH',
      headers: { 'x-admin-key': adminKey }
    });
    if (!res.ok) throw new Error('Failed to toggle review approval');
    return res.json();
  },

  // Analytics & Admin Auth
  async adminLogin(key: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });
    return res.json();
  },

  async getAnalytics(adminKey: string): Promise<AnalyticsSummary> {
    const res = await fetch(`${API_BASE}/analytics`, {
      headers: { 'x-admin-key': adminKey }
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Contact
  async sendContactMessage(data: { name: string; email?: string; phone?: string; subject?: string; message: string }): Promise<{ success: boolean; message: string; whatsappFollowupUrl: string }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit contact message');
    return res.json();
  }
};
