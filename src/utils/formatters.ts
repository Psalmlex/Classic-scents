/**
 * Formatting utilities for Le-one Jewelries
 */

export function formatNaira(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₦0';
  }
  return `₦${Number(amount).toLocaleString('en-NG')}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export const STORE_PHONE = '+234 802 335 5789';
export const STORE_WHATSAPP_NUMBER = '2348023355789';
export const STORE_ADDRESS = 'Aki Cube Mall, 3rd Ave, Gwarinpa Estate, Gwarinpa 900108, Abuja, Nigeria';
export const STORE_HOURS = 'Monday–Sunday: 9:00 AM–8:00 PM';
export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/gwxcrhkxP8BgKff77';

/**
 * Builds a direct WhatsApp chat link with optional pre-filled message
 */
export function getWhatsAppUrl(message?: string): string {
  const baseUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}`;
  if (!message) return baseUrl;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * WhatsApp message for a specific product inquiry
 */
export function getProductWhatsAppMessage(productName: string, price?: number): string {
  const priceStr = price ? ` (${formatNaira(price)})` : '';
  return `Hello Le-one Jewelries, I'm interested in ${productName}${priceStr}. Is it currently available?`;
}

/**
 * WhatsApp message for ordering a complete cart
 */
export function getCartWhatsAppMessage(
  items: { name: string; quantity: number; price: number; variations?: Record<string, string> }[],
  total: number,
  deliveryMethod?: string
): string {
  const itemList = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name} (Qty: ${item.quantity}) - ${formatNaira(item.price * item.quantity)}${
          item.variations && Object.keys(item.variations).length > 0
            ? ` [${Object.entries(item.variations).map(([k, v]) => `${k}: ${v}`).join(', ')}]`
            : ''
        }`
    )
    .join('\n');

  return `Hello Le-one Jewelries, I would like to place an order from your website:\n\n${itemList}\n\n*Total:* ${formatNaira(
    total
  )}\n*Delivery Option:* ${deliveryMethod || 'Abuja Delivery'}\n\nPlease confirm availability and payment details. Thank you!`;
}
