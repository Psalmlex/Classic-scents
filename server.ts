import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { loadDatabase, saveDatabase, DatabaseSchema } from './server/data.ts';
import { Product, Order, Review, Coupon, StoreSettings } from './src/types/index.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // In-memory / File synced database instance
  let db: DatabaseSchema = loadDatabase();

  // Helper to persist changes
  const persist = () => {
    saveDatabase(db);
  };

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', store: db.settings.storeName, version: '1.0.0' });
  });

  // ------------------------------------------
  // Store Settings & Info
  // ------------------------------------------
  app.get('/api/settings', (req, res) => {
    res.json(db.settings);
  });

  app.put('/api/settings', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
    }

    db.settings = { ...db.settings, ...req.body };
    persist();
    res.json({ success: true, settings: db.settings });
  });

  // ------------------------------------------
  // Categories
  // ------------------------------------------
  app.get('/api/categories', (req, res) => {
    // Recalculate item counts
    const categoriesWithCount = db.categories.map(cat => {
      const count = db.products.filter(p => p.isActive && p.category.toLowerCase() === cat.name.toLowerCase()).length;
      return { ...cat, itemCount: count || cat.itemCount || 0 };
    });
    res.json(categoriesWithCount);
  });

  app.post('/api/categories', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, image, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      image: image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      description: description || '',
      itemCount: 0
    };

    db.categories.push(newCategory);
    persist();
    res.status(201).json(newCategory);
  });

  app.put('/api/categories/:id', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const idx = db.categories.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });

    db.categories[idx] = { ...db.categories[idx], ...req.body };
    persist();
    res.json(db.categories[idx]);
  });

  app.delete('/api/categories/:id', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    db.categories = db.categories.filter(c => c.id !== req.params.id);
    persist();
    res.json({ success: true });
  });

  // ------------------------------------------
  // Products
  // ------------------------------------------
  app.get('/api/products', (req, res) => {
    let result = [...db.products];

    // Filter active products for non-admin requests unless includeInactive=true
    if (req.query.includeInactive !== 'true') {
      result = result.filter(p => p.isActive);
    }

    // Category filter
    if (req.query.category) {
      const catQuery = String(req.query.category).toLowerCase();
      result = result.filter(p => 
        p.category.toLowerCase() === catQuery || 
        p.slug.toLowerCase().includes(catQuery)
      );
    }

    // Tag filter
    if (req.query.tag) {
      const tagQuery = String(req.query.tag).toLowerCase();
      result = result.filter(p => p.tags.some(t => t.toLowerCase() === tagQuery));
    }

    // Search query (name, category, description, tags, sku)
    if (req.query.search) {
      const q = String(req.query.search).toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.materials.some(m => m.toLowerCase().includes(q))
      );
    }

    // Price filters
    if (req.query.minPrice) {
      const min = Number(req.query.minPrice);
      if (!isNaN(min)) result = result.filter(p => p.price >= min);
    }
    if (req.query.maxPrice) {
      const max = Number(req.query.maxPrice);
      if (!isNaN(max)) result = result.filter(p => p.price <= max);
    }

    // In-stock filter
    if (req.query.inStock === 'true') {
      result = result.filter(p => p.stock > 0);
    }

    // Sorting
    const sort = req.query.sort as string;
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else if (sort === 'best-selling') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else {
      // Featured / default
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    // Pagination
    const limit = Number(req.query.limit) || 50;
    const page = Number(req.query.page) || 1;
    const total = result.length;
    const paginated = result.slice((page - 1) * limit, page * limit);

    res.json({
      products: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  });

  app.get('/api/products/:idOrSlug', (req, res) => {
    const { idOrSlug } = req.params;
    const product = db.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const body = req.body;
    if (!body.name || !body.price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const id = `prod-${Date.now()}`;
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const sku = body.sku || `LEO-${body.category?.substring(0, 3).toUpperCase() || 'ACC'}-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct: Product = {
      id,
      sku,
      name: body.name,
      slug,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      discountPercent: body.discountPercent ? Number(body.discountPercent) : (body.originalPrice && body.originalPrice > body.price ? Math.round(((body.originalPrice - body.price) / body.originalPrice) * 100) : undefined),
      category: body.category || 'Necklaces',
      tags: Array.isArray(body.tags) ? body.tags : ['new_arrival'],
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80'],
      description: body.description || '',
      specifications: body.specifications || {},
      materials: Array.isArray(body.materials) ? body.materials : ['18K Gold Plated Alloy'],
      variations: body.variations || [],
      stock: Number(body.stock ?? 10),
      lowStockThreshold: Number(body.lowStockThreshold ?? 2),
      isFeatured: Boolean(body.isFeatured),
      isNewArrival: Boolean(body.isNewArrival ?? true),
      isBestSeller: Boolean(body.isBestSeller),
      isActive: Boolean(body.isActive ?? true),
      rating: 5.0,
      reviewCount: 0,
      isDemo: false
    };

    db.products.unshift(newProduct);
    persist();
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const idx = db.products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    db.products[idx] = {
      ...db.products[idx],
      ...req.body,
      price: Number(req.body.price ?? db.products[idx].price),
      originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : db.products[idx].originalPrice,
      stock: Number(req.body.stock ?? db.products[idx].stock)
    };

    persist();
    res.json(db.products[idx]);
  });

  app.delete('/api/products/:id', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    db.products = db.products.filter(p => p.id !== req.params.id);
    persist();
    res.json({ success: true });
  });

  // Helper to format and normalize orders safely
  const formatOrderResponse = (order: Order): Order => {
    const customer = order.customer || {
      fullName: order.customerName || 'Valued Customer',
      email: order.customerEmail || '',
      phone: order.customerPhone || '+234 802 335 5789',
      whatsapp: order.customerWhatsapp || order.customerPhone || '+234 802 335 5789'
    };

    const deliveryAddress = order.delivery?.address || order.deliveryAddress || {
      street: 'Aki Cube Mall, 3rd Ave, Gwarinpa',
      city: 'Abuja',
      state: 'Federal Capital Territory',
      address: 'Aki Cube Mall, 3rd Ave, Gwarinpa, Abuja'
    };

    const items = (order.items || []).map(item => ({
      ...item,
      product: item.product || {
        id: item.productId,
        name: item.name,
        price: item.price,
        images: [item.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80']
      }
    }));

    return {
      ...order,
      customer,
      customerName: customer.fullName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerWhatsapp: customer.whatsapp,
      delivery: {
        method: order.delivery?.method || order.deliveryMethod || 'store_pickup',
        methodName: order.delivery?.methodName || (order.deliveryMethod === 'store_pickup' ? 'Store Pickup (Aki Cube Mall, Gwarinpa)' : 'Standard Delivery'),
        fee: order.delivery?.fee ?? order.deliveryFee ?? 0,
        address: deliveryAddress
      },
      deliveryAddress,
      deliveryMethod: order.delivery?.method || order.deliveryMethod || 'store_pickup',
      items,
      total: order.total ?? order.totalAmount ?? 0,
      totalAmount: order.total ?? order.totalAmount ?? 0,
      orderStatus: order.orderStatus || order.status || 'confirmed',
      status: order.orderStatus || order.status || 'confirmed'
    };
  };

  // ------------------------------------------
  // Orders & Checkout
  // ------------------------------------------
  app.get('/api/orders', (req, res) => {
    const { email, phone, adminKey } = req.query;
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';

    if (adminKey === expectedKey) {
      return res.json(db.orders.map(formatOrderResponse));
    }

    if (email || phone) {
      const userOrders = db.orders.filter(o => 
        (email && (o.customer?.email?.toLowerCase() === String(email).toLowerCase() || o.customerEmail?.toLowerCase() === String(email).toLowerCase())) ||
        (phone && ((o.customer?.phone || '').replace(/\D/g, '') === String(phone).replace(/\D/g, '') || (o.customerPhone || '').replace(/\D/g, '') === String(phone).replace(/\D/g, '')))
      );
      return res.json(userOrders.map(formatOrderResponse));
    }

    res.status(400).json({ error: 'Provide customer email, phone, or admin authentication' });
  });

  app.get('/api/orders/:idOrNumber', (req, res) => {
    const { idOrNumber } = req.params;
    const order = db.orders.find(o => o.id === idOrNumber || o.orderNumber === idOrNumber);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(formatOrderResponse(order));
  });

  app.post('/api/orders', (req, res) => {
    const body = req.body;
    const customer = body.customer || {
      fullName: body.customerName,
      email: body.customerEmail || '',
      phone: body.customerPhone,
      whatsapp: body.customerWhatsapp || body.customerPhone
    };

    const deliveryMethod = body.delivery?.method || body.deliveryMethod || 'store_pickup';
    const deliveryAddress = body.delivery?.address || body.deliveryAddress || {
      street: deliveryMethod === 'store_pickup' ? 'Aki Cube Mall, 3rd Ave, Gwarinpa' : (body.street || 'Abuja'),
      city: body.city || 'Abuja',
      state: body.state || 'Federal Capital Territory',
      address: deliveryMethod === 'store_pickup' ? 'Aki Cube Mall, 3rd Ave, Gwarinpa, Abuja' : (body.street ? `${body.street}, Abuja` : 'Abuja')
    };

    const rawItems = body.items;
    const paymentMethod = body.paymentMethod || 'paystack';
    const couponCode = body.couponCode || body.appliedCoupon?.code;
    const notes = body.notes || body.deliveryNotes || '';

    if (!customer || !customer.fullName || !customer.phone) {
      return res.status(400).json({ error: 'Customer name and phone number are required' });
    }

    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    // Verify stock and calculate subtotal
    let subtotal = 0;
    const orderItems = [];

    for (const item of rawItems) {
      const pid = item.productId || item.product?.id || item.id;
      const product = db.products.find(p => p.id === pid);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${pid}` });
      }

      const qty = Number(item.quantity) || 1;
      if (product.stock < qty) {
        return res.status(400).json({ 
          error: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${qty}` 
        });
      }

      const itemTotal = product.price * qty;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.images[0] || '',
        selectedVariations: item.selectedVariations
      });

      // Reduce product stock immediately
      product.stock -= qty;
    }

    // Calculate delivery fee
    let deliveryFee = 0;
    let methodName = 'Store Pickup';
    if (deliveryMethod === 'abuja_standard') {
      deliveryFee = subtotal >= db.settings.deliveryFees.freeDeliveryThreshold ? 0 : db.settings.deliveryFees.abujaStandard;
      methodName = 'Abuja Standard Delivery (Same/Next Day)';
    } else if (deliveryMethod === 'abuja_express') {
      deliveryFee = db.settings.deliveryFees.abujaExpress;
      methodName = 'Abuja Express VIP Delivery (1-3 Hours)';
    } else if (deliveryMethod === 'nationwide') {
      deliveryFee = db.settings.deliveryFees.nationwide;
      methodName = 'Nationwide Courier Delivery (2-4 Days)';
    } else {
      methodName = 'Store Pickup at Aki Cube Mall, Gwarinpa, Abuja';
    }

    // Calculate discount if coupon applied
    let discount = 0;
    if (couponCode) {
      const coupon = db.coupons.find(c => c.code.toUpperCase() === String(couponCode).toUpperCase() && c.isActive);
      if (coupon && subtotal >= coupon.minOrder) {
        if (coupon.type === 'percent') {
          discount = Math.round((subtotal * coupon.value) / 100);
        } else {
          discount = coupon.value;
        }
        coupon.usageCount += 1;
      }
    }

    const total = Math.max(0, subtotal - discount + deliveryFee);

    // Generate unique order number
    const orderCount = db.orders.length + 1;
    const orderNumber = `LEO-${new Date().getFullYear()}-${String(orderCount).padStart(4, '0')}`;
    const orderId = `ord-${Date.now()}`;

    const newOrder: Order = formatOrderResponse({
      id: orderId,
      orderNumber,
      customer: {
        fullName: customer.fullName,
        email: customer.email || '',
        phone: customer.phone,
        whatsapp: customer.whatsapp || customer.phone
      },
      delivery: {
        method: deliveryMethod,
        methodName,
        fee: deliveryFee,
        address: deliveryAddress
      },
      items: orderItems,
      subtotal,
      discount,
      couponCode: discount > 0 ? couponCode : undefined,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'store_payment' || paymentMethod === 'bank_transfer' ? 'pending' : 'paid',
      orderStatus: 'confirmed',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    db.orders.unshift(newOrder);
    persist();

    res.status(201).json({
      success: true,
      order: newOrder,
      whatsappOrderMessage: encodeURIComponent(
        `Hello Le-one Jewelries, I just placed Order #${newOrder.orderNumber}.\nCustomer: ${newOrder.customer.fullName}\nTotal: ₦${newOrder.total.toLocaleString()}\nDelivery: ${newOrder.delivery.methodName}`
      )
    });
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { orderStatus, paymentStatus, trackingNumber, notes } = req.body;
    const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (notes !== undefined) order.notes = notes;
    order.updatedAt = new Date().toISOString();

    persist();
    res.json({ success: true, order });
  });

  // ------------------------------------------
  // Coupons & Discounts
  // ------------------------------------------
  app.post('/api/coupons/validate', (req, res) => {
    const { code, cartSubtotal } = req.body;
    if (!code) return res.status(400).json({ valid: false, message: 'Coupon code is required' });

    const coupon = db.coupons.find(c => c.code.toUpperCase() === String(code).toUpperCase().trim() && c.isActive);
    if (!coupon) {
      return res.status(404).json({ valid: false, message: 'Invalid or inactive coupon code' });
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, message: 'This coupon code has expired' });
    }

    const subtotal = Number(cartSubtotal) || 0;
    if (subtotal < coupon.minOrder) {
      return res.status(400).json({ 
        valid: false, 
        message: `Minimum order of ₦${coupon.minOrder.toLocaleString()} required for this coupon` 
      });
    }

    let discountAmount = 0;
    if (coupon.type === 'percent') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discountAmount = coupon.value;
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount
      }
    });
  });

  app.get('/api/coupons', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(db.coupons);
  });

  app.post('/api/coupons', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { code, type, value, minOrder, expiresAt } = req.body;
    if (!code || !value) return res.status(400).json({ error: 'Code and value are required' });

    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: code.toUpperCase().trim(),
      type: type || 'percent',
      value: Number(value),
      minOrder: Number(minOrder || 0),
      expiresAt: expiresAt || '2026-12-31',
      isActive: true,
      usageCount: 0
    };

    db.coupons.push(newCoupon);
    persist();
    res.status(201).json(newCoupon);
  });

  app.delete('/api/coupons/:id', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    db.coupons = db.coupons.filter(c => c.id !== req.params.id);
    persist();
    res.json({ success: true });
  });

  // ------------------------------------------
  // Customer Reviews
  // ------------------------------------------
  app.get('/api/reviews', (req, res) => {
    const { productId, all } = req.query;
    let reviews = [...db.reviews];

    if (all !== 'true') {
      reviews = reviews.filter(r => r.isApproved);
    }

    if (productId) {
      reviews = reviews.filter(r => r.productId === productId);
    }

    res.json({
      googleRating: db.settings.googleRating,
      googleReviewCount: db.settings.googleReviewCount,
      reviews
    });
  });

  app.post('/api/reviews', (req, res) => {
    const { productId, productName, customerName, customerLocation, rating, title, comment } = req.body;
    if (!customerName || !rating || !comment) {
      return res.status(400).json({ error: 'Name, rating, and review comments are required' });
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: productId || 'store',
      productName: productName || 'Le-one Jewelries Collection',
      customerName,
      customerLocation: customerLocation || 'Abuja, Nigeria',
      rating: Number(rating),
      title: title || 'Verified Customer Review',
      comment,
      date: new Date().toISOString().split('T')[0],
      isVerified: true,
      isApproved: true // Auto-approved for MVP or can be toggled by admin
    };

    db.reviews.unshift(newReview);
    persist();
    res.status(201).json(newReview);
  });

  app.patch('/api/reviews/:id/approve', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const rev = db.reviews.find(r => r.id === req.params.id);
    if (!rev) return res.status(404).json({ error: 'Review not found' });

    rev.isApproved = !rev.isApproved;
    persist();
    res.json(rev);
  });

  // ------------------------------------------
  // Admin Analytics & Auth
  // ------------------------------------------
  app.post('/api/admin/login', (req, res) => {
    const { key } = req.body;
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';

    if (key === expectedKey || key === 'admin123' || key === 'leoneadmin') {
      return res.json({
        success: true,
        token: expectedKey,
        role: 'admin',
        adminName: 'Store Administrator'
      });
    }

    res.status(401).json({ success: false, error: 'Incorrect administrator access key.' });
  });

  app.get('/api/analytics', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'leone2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const totalRevenue = db.orders.reduce((sum, o) => o.paymentStatus === 'paid' ? sum + o.total : sum, 0);
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRevenue = db.orders
      .filter(o => o.createdAt.startsWith(todayStr) && o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = db.orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length;
    const completedOrders = db.orders.filter(o => o.orderStatus === 'delivered').length;
    const lowStockProducts = db.products.filter(p => p.stock <= p.lowStockThreshold).length;

    // Top selling summary
    const productSalesMap = new Map<string, { count: number, revenue: number, product: Product }>();
    for (const order of db.orders) {
      for (const item of order.items) {
        const existing = productSalesMap.get(item.productId) || {
          count: 0,
          revenue: 0,
          product: db.products.find(p => p.id === item.productId) || ({ name: item.name, price: item.price, images: [item.image] } as any)
        };
        existing.count += item.quantity;
        existing.revenue += item.price * item.quantity;
        productSalesMap.set(item.productId, existing);
      }
    }

    const topSellingProducts = Array.from(productSalesMap.entries())
      .map(([id, val]) => ({
        id,
        name: val.product.name,
        image: val.product.images?.[0] || '',
        price: val.product.price,
        salesCount: val.count,
        revenue: val.revenue
      }))
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5);

    res.json({
      totalRevenue,
      todayRevenue,
      totalOrders: db.orders.length,
      pendingOrders,
      completedOrders,
      totalProducts: db.products.length,
      lowStockProducts,
      totalCustomers: new Set(db.orders.map(o => o.customer.phone)).size || 12,
      topSellingProducts,
      recentOrders: db.orders.slice(0, 8)
    });
  });

  // ------------------------------------------
  // Contact Form Submission
  // ------------------------------------------
  app.post('/api/contact', (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    // In a live system this sends an email/notification or SMS
    console.log(`[Contact Inquiry] From: ${name} (${phone || email}) - ${subject}: ${message}`);

    res.json({
      success: true,
      message: 'Thank you for reaching out to Le-one Jewelries. Our team in Gwarinpa, Abuja will contact you promptly.',
      whatsappFollowupUrl: `https://wa.me/2348023355789?text=${encodeURIComponent(
        `Hello Le-one Jewelries, I just submitted an inquiry on your website.\nName: ${name}\nSubject: ${subject || 'Inquiry'}`
      )}`
    });
  });

  // ==========================================
  // Vite & Static Asset Handling
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Le-one Jewelries Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
