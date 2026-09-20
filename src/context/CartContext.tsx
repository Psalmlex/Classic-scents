import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, DeliveryMethod } from '../types/index.ts';
import { apiService } from '../services/api.ts';
import { getCartWhatsAppMessage } from '../utils/formatters.ts';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  appliedCoupon: string | null;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  total: number;
  isCartDrawerOpen: boolean;
  freeDeliveryThreshold: number;
  amountToFreeDelivery: number;
  addToCart: (product: Product, quantity?: number, selectedVariations?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariations?: Record<string, string>) => void;
  removeFromCart: (productId: string, selectedVariations?: Record<string, string>) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  getWhatsAppOrderUrl: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'leone_cart_items_v1';
const COUPON_STORAGE_KEY = 'leone_cart_coupon_v1';
const DELIVERY_STORAGE_KEY = 'leone_cart_delivery_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    return localStorage.getItem(COUPON_STORAGE_KEY) || null;
  });

  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const [deliveryMethod, setDeliveryMethodState] = useState<DeliveryMethod>(() => {
    return (localStorage.getItem(DELIVERY_STORAGE_KEY) as DeliveryMethod) || 'abuja_standard';
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  // Constants
  const freeDeliveryThreshold = 150000;

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, appliedCoupon);
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const setDeliveryMethod = (method: DeliveryMethod) => {
    setDeliveryMethodState(method);
    localStorage.setItem(DELIVERY_STORAGE_KEY, method);
  };

  // Subtotal calculation
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Delivery fee calculation
  let deliveryFee = 0;
  if (deliveryMethod === 'abuja_standard') {
    deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : 2500;
  } else if (deliveryMethod === 'abuja_express') {
    deliveryFee = 4500;
  } else if (deliveryMethod === 'nationwide') {
    deliveryFee = 5500;
  } else {
    deliveryFee = 0; // store_pickup
  }

  // Validate coupon whenever subtotal changes
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      apiService.validateCoupon(appliedCoupon, subtotal).then(res => {
        if (res.valid && res.coupon) {
          setDiscountAmount(res.coupon.discountAmount);
        } else {
          setDiscountAmount(0);
          setAppliedCoupon(null);
        }
      }).catch(() => {
        setDiscountAmount(0);
      });
    } else {
      setDiscountAmount(0);
    }
  }, [appliedCoupon, subtotal]);

  const total = Math.max(0, subtotal - discountAmount + deliveryFee);
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  // Helper to match variation equality
  const areVariationsEqual = (
    v1?: Record<string, string>,
    v2?: Record<string, string>
  ): boolean => {
    if (!v1 && !v2) return true;
    if (!v1 || !v2) return false;
    const keys1 = Object.keys(v1);
    const keys2 = Object.keys(v2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(k => v1[k] === v2[k]);
  };

  const addToCart = (product: Product, quantity: number = 1, selectedVariations?: Record<string, string>) => {
    setItems(prev => {
      const existingIdx = prev.findIndex(
        i => i.productId === product.id && areVariationsEqual(i.selectedVariations, selectedVariations)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: Math.min(newQty, product.stock || 99)
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            quantity: Math.min(quantity, product.stock || 99),
            selectedVariations,
            product
          }
        ];
      }
    });

    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number, selectedVariations?: Record<string, string>) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariations);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.productId === productId && areVariationsEqual(item.selectedVariations, selectedVariations)) {
          return {
            ...item,
            quantity: Math.min(quantity, item.product.stock || 99)
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, selectedVariations?: Record<string, string>) => {
    setItems(prev =>
      prev.filter(item => !(item.productId === productId && areVariationsEqual(item.selectedVariations, selectedVariations)))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!code.trim()) {
      return { success: false, message: 'Please enter a coupon code' };
    }

    try {
      const res = await apiService.validateCoupon(code, subtotal);
      if (res.valid && res.coupon) {
        setAppliedCoupon(res.coupon.code);
        setDiscountAmount(res.coupon.discountAmount);
        return { success: true, message: `Coupon ${res.coupon.code} applied! Saved ₦${res.coupon.discountAmount.toLocaleString()}` };
      } else {
        return { success: false, message: res.message || 'Invalid coupon code' };
      }
    } catch {
      return { success: false, message: 'Could not validate coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const getWhatsAppOrderUrl = () => {
    const cartItemsSummary = items.map(i => ({
      name: i.product.name,
      quantity: i.quantity,
      price: i.product.price,
      variations: i.selectedVariations
    }));

    const deliveryNameMap: Record<DeliveryMethod, string> = {
      abuja_standard: 'Abuja Standard Delivery',
      abuja_express: 'Abuja Express VIP Delivery',
      nationwide: 'Nationwide Delivery',
      store_pickup: 'Store Pickup at Aki Cube Mall, Gwarinpa'
    };

    const msg = getCartWhatsAppMessage(cartItemsSummary, total, deliveryNameMap[deliveryMethod]);
    return `https://wa.me/2348023355789?text=${encodeURIComponent(msg)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount: discountAmount,
        appliedCoupon,
        deliveryMethod,
        deliveryFee,
        total,
        isCartDrawerOpen,
        freeDeliveryThreshold,
        amountToFreeDelivery,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        setDeliveryMethod,
        setIsCartDrawerOpen,
        getWhatsAppOrderUrl
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
