import fs from 'fs';
import path from 'path';
import { Product, Category, Order, Review, Coupon, StoreSettings, UserProfile } from '../src/types/index.ts';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const initialCategories: Category[] = [
  {
    id: 'cat-necklaces',
    name: 'Necklaces',
    slug: 'necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    description: 'Chains, pendants, statement pieces and layered gold necklaces.',
    itemCount: 4
  },
  {
    id: 'cat-earrings',
    name: 'Earrings',
    slug: 'earrings',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    description: 'Studs, hoops, drops, chandeliers and crystal statement earrings.',
    itemCount: 3
  },
  {
    id: 'cat-rings',
    name: 'Rings',
    slug: 'rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    description: 'Eternity bands, solitaire rings, cocktail rings and stackable designs.',
    itemCount: 3
  },
  {
    id: 'cat-bracelets',
    name: 'Bracelets',
    slug: 'bracelets',
    image: 'https://images.unsplash.com/photo-1611591475887-fa856e7e4526?auto=format&fit=crop&w=800&q=80',
    description: 'Tennis bracelets, bangles, cuffs, and charm bracelets.',
    itemCount: 3
  },
  {
    id: 'cat-watches',
    name: 'Watches',
    slug: 'watches',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    description: 'Luxury timepieces for men and women with stainless steel and leather straps.',
    itemCount: 2
  },
  {
    id: 'cat-sets',
    name: 'Jewelry Sets',
    slug: 'jewelry-sets',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    description: 'Curated matching sets for weddings, galas, and special occasions.',
    itemCount: 2
  },
  {
    id: 'cat-women',
    name: "Women's Jewelry",
    slug: 'womens-jewelry',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    description: 'Timeless feminine jewelry designed to elevate every daily and bridal look.',
    itemCount: 8
  },
  {
    id: 'cat-men',
    name: "Men's Jewelry",
    slug: 'mens-jewelry',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
    description: 'Cuban links, signet rings, leather and steel wristwear for gentlemen.',
    itemCount: 3
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
    description: 'Brooches, jewelry boxes, travel cases, and polishing cloths.',
    itemCount: 2
  },
  {
    id: 'cat-gifts',
    name: 'Gifts',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    description: 'Curated luxury gifts packaged in our signature Le-one presentation box.',
    itemCount: 4
  },
  {
    id: 'cat-perfumes',
    name: 'Perfumes & Fragrances',
    slug: 'perfumes-and-fragrances',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    description: 'Niche Arabian ouds, French florals, luxury extraits de parfum, and signature scents.',
    itemCount: 2
  },
  {
    id: 'cat-bags',
    name: 'Luxury Bags & Clutches',
    slug: 'luxury-bags-and-clutches',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    description: 'Handcrafted leather tote bags, evening crystal clutches, and designer accessories.',
    itemCount: 1
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-001',
    sku: 'LEO-NCK-001',
    name: 'Classic Gold Necklace',
    slug: 'classic-gold-necklace',
    price: 68000,
    originalPrice: 80000,
    discountPercent: 15,
    category: 'Necklaces',
    tags: ['featured', 'best_seller'],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611591475887-fa856e7e4526?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'An enduring classic featuring a lustrous 18k gold-plated herringbone weave chain. Crafted for sophisticated layering or as a bold standalone statement at any Abuja event.',
    specifications: {
      'Chain Length': '18 inches with 2-inch extender',
      'Clasp Type': 'Lobster Claw',
      'Finish': '18K Yellow Gold Plating',
      'Origin': 'Carefully curated for Le-one Jewelries'
    },
    materials: ['18K Yellow Gold Plating', 'Hypoallergenic Stainless Steel Base'],
    variations: [
      { name: 'Length', options: ['18 inch', '20 inch', '22 inch'] },
      { name: 'Color', options: ['Yellow Gold', 'Rose Gold'] }
    ],
    stock: 12,
    lowStockThreshold: 3,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 14,
    isDemo: true
  },
  {
    id: 'prod-002',
    sku: 'LEO-EAR-002',
    name: 'Elegant Crystal Drop Earrings',
    slug: 'elegant-crystal-earrings',
    price: 35000,
    originalPrice: 42000,
    discountPercent: 17,
    category: 'Earrings',
    tags: ['featured', 'new_arrival'],
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Radiant emerald-cut cubic zirconia crystals suspended on fine gold-plated prongs. Catches light effortlessly from every angle, making them perfect for celebrations and evenings out.',
    specifications: {
      'Earring Type': 'Drop / Chandelier',
      'Stone Type': 'AAA Grade Cubic Zirconia',
      'Weight': '6.4g per pair',
      'Backing': 'Push Back'
    },
    materials: ['AAA+ Cubic Zirconia', '18K Gold Plated Alloy', 'Nickel-free'],
    variations: [
      { name: 'Stone Color', options: ['Clear Diamond', 'Emerald Green', 'Sapphire Blue'] }
    ],
    stock: 8,
    lowStockThreshold: 2,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isActive: true,
    rating: 4.8,
    reviewCount: 9,
    isDemo: true
  },
  {
    id: 'prod-003',
    sku: 'LEO-BRC-003',
    name: 'Luxury Tennis Bracelet',
    slug: 'luxury-bracelet',
    price: 52000,
    originalPrice: 60000,
    discountPercent: 13,
    category: 'Bracelets',
    tags: ['featured', 'best_seller'],
    images: [
      'https://images.unsplash.com/photo-1611591475887-fa856e7e4526?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A continuous line of brilliant brilliant-cut zirconia stones set securely in four-prong 18k gold baskets. Features a double safety clasp for absolute security on your wrist.',
    specifications: {
      'Bracelet Length': '7.0 inches (18cm)',
      'Stone Size': '3mm round brilliant',
      'Clasp': 'Box clasp with dual safety latch',
      'Finish': 'Polished Gold'
    },
    materials: ['High-Grade Zirconia', 'Gold Electroplated Brass', 'Hypoallergenic'],
    variations: [
      { name: 'Wrist Size', options: ['6.5 inch (Small)', '7.0 inch (Standard)', '7.5 inch (Large)'] },
      { name: 'Finish', options: ['Yellow Gold', 'White Gold / Silver'] }
    ],
    stock: 6,
    lowStockThreshold: 2,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isActive: true,
    rating: 5.0,
    reviewCount: 18,
    isDemo: true
  },
  {
    id: 'prod-004',
    sku: 'LEO-WAT-004',
    name: "Classic Women's Gold Watch",
    slug: 'classic-womens-watch',
    price: 95000,
    originalPrice: 115000,
    discountPercent: 17,
    category: 'Watches',
    tags: ['featured', 'best_seller'],
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'An impeccably crafted timepiece featuring a shimmering Mother of Pearl dial, Roman numeral hour markers, and a sleek gold-tone link bracelet. Water-resistant and reliable quartz precision.',
    specifications: {
      'Movement': 'Japanese Quartz Precision',
      'Case Diameter': '32mm',
      'Case Thickness': '8mm',
      'Water Resistance': '3 ATM (Splash proof)'
    },
    materials: ['316L Stainless Steel', 'Mineral Crystal Glass', 'Mother of Pearl Dial'],
    variations: [
      { name: 'Dial Style', options: ['Mother of Pearl', 'Classic Champagne Gold', 'Emerald Sunburst'] }
    ],
    stock: 5,
    lowStockThreshold: 2,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 11,
    isDemo: true
  },
  {
    id: 'prod-005',
    sku: 'LEO-RNG-005',
    name: 'Gold-Plated Solitaire Ring',
    slug: 'gold-plated-ring',
    price: 28000,
    originalPrice: 35000,
    discountPercent: 20,
    category: 'Rings',
    tags: ['featured', 'on_sale'],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A tasteful solitaire ring with micro-pavé shoulder accents that radiate refined luxury. Designed to be worn solo or stacked gracefully alongside wedding bands.',
    specifications: {
      'Band Width': '2.2mm',
      'Center Stone': '1.5 Carat Equivalent Solitaire',
      'Setting': '6-Prong Crown'
    },
    materials: ['18K Yellow Gold Plating', '925 Sterling Silver Core', 'Simulated Diamond'],
    variations: [
      { name: 'Ring Size', options: ['US 6', 'US 7', 'US 8', 'US 9', 'Adjustable'] }
    ],
    stock: 15,
    lowStockThreshold: 4,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false,
    isActive: true,
    rating: 4.7,
    reviewCount: 8,
    isDemo: true
  },
  {
    id: 'prod-006',
    sku: 'LEO-SET-006',
    name: 'Royal Bridal & Gala Jewelry Gift Set',
    slug: 'jewelry-gift-set',
    price: 180000,
    originalPrice: 220000,
    discountPercent: 18,
    category: 'Jewelry Sets',
    tags: ['featured', 'gifts', 'best_seller'],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A 4-piece luxury ensemble including a majestic necklace, drop earrings, tennis bracelet, and matching statement ring. Presented in a custom velvet-lined Le-one gift case.',
    specifications: {
      'Pieces Included': 'Necklace, Pair of Earrings, Bracelet, Ring',
      'Packaging': 'Signature Velvet Gift Box with Ribbon',
      'Occasion': 'Weddings, Anniversaries, Gala Dinners'
    },
    materials: ['18K Gold Finish', 'Cubic Zirconia Clusters', 'Precious Alloy'],
    variations: [
      { name: 'Set Colorway', options: ['Gold & Crystal', 'White Gold & Emerald', 'Rose Gold'] }
    ],
    stock: 4,
    lowStockThreshold: 1,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isActive: true,
    rating: 5.0,
    reviewCount: 7,
    isDemo: true
  },
  {
    id: 'prod-007',
    sku: 'LEO-MEN-007',
    name: "Men's Gold & Steel Cuban Link Bracelet",
    slug: 'mens-bracelet',
    price: 45000,
    originalPrice: 55000,
    discountPercent: 18,
    category: "Men's Jewelry",
    tags: ['featured', 'best_seller'],
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611591475887-fa856e7e4526?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Heavyweight Cuban link bracelet forged from solid 316L surgical-grade stainless steel with durable 18K gold PVD vacuum coating. Sweat-proof, tarnish-resistant, and masculine.',
    specifications: {
      'Link Width': '10mm',
      'Length': '8.5 inches (21.5cm)',
      'Weight': '48g',
      'Clasp': 'Heavy duty box lock'
    },
    materials: ['316L Stainless Steel', '18K Gold PVD Coating'],
    variations: [
      { name: 'Finish', options: ['Yellow Gold', 'Two-Tone Gold & Silver', 'Matte Black Steel'] }
    ],
    stock: 9,
    lowStockThreshold: 3,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 16,
    isDemo: true
  },
  {
    id: 'prod-008',
    sku: 'LEO-NCK-008',
    name: 'Freshwater Baroque Pearl Necklace',
    slug: 'pearl-necklace',
    price: 78000,
    originalPrice: 90000,
    discountPercent: 13,
    category: 'Necklaces',
    tags: ['featured', 'new_arrival'],
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Individually hand-knotted genuine freshwater cultured baroque pearls with organic contours. Accented with an ornate 18K gold magnetic toggle clasp.',
    specifications: {
      'Pearl Type': 'Cultured Freshwater Baroque',
      'Pearl Diameter': '8-10mm',
      'Length': '17.5 inches',
      'Clasp': '18K Gold Plated Toggle'
    },
    materials: ['Freshwater Cultured Pearls', 'Silk Thread', '18K Gold Hardware'],
    variations: [
      { name: 'Length', options: ['Choker (16 in)', 'Princess (18 in)', 'Matinee (20 in)'] }
    ],
    stock: 7,
    lowStockThreshold: 2,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isActive: true,
    rating: 4.9,
    reviewCount: 12,
    isDemo: true
  },
  {
    id: 'prod-009',
    sku: 'LEO-EAR-009',
    name: 'Diamond-Cut Huggie Hoop Earrings',
    slug: 'diamond-cut-huggie-hoop-earrings',
    price: 32000,
    originalPrice: 38000,
    discountPercent: 15,
    category: 'Earrings',
    tags: ['new_arrival', 'best_seller'],
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Chic everyday mini huggies embellished with pavé CZ stones. Click-in secure closure designed for comfortable all-day wear without catching on fabrics.',
    specifications: {
      'Diameter': '12mm outer / 9mm inner',
      'Width': '3.5mm',
      'Clasp': 'Snap bar hinge'
    },
    materials: ['18K Gold Plated Brass', 'CZ Micro-Pavé'],
    variations: [
      { name: 'Metal', options: ['Yellow Gold', 'White Gold', 'Rose Gold'] }
    ],
    stock: 14,
    lowStockThreshold: 3,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    isActive: true,
    rating: 4.8,
    reviewCount: 6,
    isDemo: true
  },
  {
    id: 'prod-010',
    sku: 'LEO-RNG-010',
    name: "Men's Black Onyx Gold Signet Ring",
    slug: 'mens-black-onyx-signet-ring',
    price: 36000,
    originalPrice: 45000,
    discountPercent: 20,
    category: "Men's Jewelry",
    tags: ['new_arrival'],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A stately square-cut natural black onyx stone encased in brushed and polished gold. A distinguished statement of power and confidence.',
    specifications: {
      'Face Dimension': '14mm x 14mm',
      'Band Width': '6mm tapered',
      'Stone': 'Natural Onyx Inlay'
    },
    materials: ['Solid Stainless Steel', '18K Gold PVD Plated', 'Natural Onyx'],
    variations: [
      { name: 'Ring Size', options: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'] }
    ],
    stock: 8,
    lowStockThreshold: 2,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    isActive: true,
    rating: 4.7,
    reviewCount: 5,
    isDemo: true
  },
  {
    id: 'prod-011',
    sku: 'LEO-BRC-011',
    name: 'Roman Numeral Luxury Bangle',
    slug: 'roman-numeral-luxury-bangle',
    price: 38000,
    originalPrice: 46000,
    discountPercent: 17,
    category: 'Bracelets',
    tags: ['best_seller', 'featured'],
    images: [
      'https://images.unsplash.com/photo-1611591475887-fa856e7e4526?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Engraved Roman numeral markers paired with bezel-set crystals. Ergonomic oval contour fits snugly on the wrist with an easy hinge mechanism.',
    specifications: {
      'Inner Circumference': '17cm',
      'Width': '6mm',
      'Hinge': 'Spring push lock'
    },
    materials: ['Titanium Steel', '18K Gold Ion Plating', 'Crystal Accents'],
    variations: [
      { name: 'Color', options: ['Gold', 'Silver', 'Rose Gold'] }
    ],
    stock: 11,
    lowStockThreshold: 3,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isActive: true,
    rating: 4.8,
    reviewCount: 9,
    isDemo: true
  },
  {
    id: 'prod-012',
    sku: 'LEO-WAT-012',
    name: "Men's Luxury Chronograph Watch",
    slug: 'mens-luxury-chronograph-watch',
    price: 110000,
    originalPrice: 135000,
    discountPercent: 18,
    category: 'Watches',
    tags: ['featured', 'best_seller'],
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Precision multi-dial chronograph with tachymeter bezel, date window, and sapphire-coated crystal. Bold presence suited for boardrooms and black-tie galas in Abuja.',
    specifications: {
      'Case Size': '42mm',
      'Movement': 'High-Precision Chrono Quartz',
      'Strap': 'Solid Link Gold Stainless Steel',
      'Water Resistance': '50M (5 ATM)'
    },
    materials: ['316L Stainless Steel', 'Hardlex Crystal', 'Luminous Hands'],
    variations: [
      { name: 'Dial', options: ['Midnight Black & Gold', 'Emerald Green & Gold', 'Royal Blue & Gold'] }
    ],
    stock: 4,
    lowStockThreshold: 1,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isActive: true,
    rating: 5.0,
    reviewCount: 14,
    isDemo: true
  },
  {
    id: 'prod-013',
    sku: 'LEO-PRF-013',
    name: 'Oud Royale Extrait de Parfum',
    slug: 'oud-royale-extrait-de-parfum',
    price: 95000,
    originalPrice: 120000,
    discountPercent: 21,
    category: 'Perfumes & Fragrances',
    tags: ['featured', 'best_seller', 'new_arrival'],
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'An opulent, long-lasting oriental fragrance featuring rare Cambodian oud, smoky amber, Bulgarian rose, and velvety Madagascar vanilla. Projects a regal sillage that lingers gracefully for over 24 hours.',
    specifications: {
      'Volume': '100ml / 3.4 fl. oz.',
      'Concentration': 'Extrait de Parfum (30% Oil)',
      'Scent Profile': 'Smoky Oud, Warm Amber, Spiced Rose',
      'Gender': 'Unisex'
    },
    materials: ['Glass Flacon with Gold Crest', 'Magnetic Cap', 'Natural Fragrance Oils'],
    variations: [
      { name: 'Bottle Size', options: ['50ml Travel Flacon', '100ml Signature Flacon'] }
    ],
    stock: 7,
    lowStockThreshold: 2,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 18,
    isDemo: false
  },
  {
    id: 'prod-014',
    sku: 'LEO-PRF-014',
    name: 'Golden Amber Pour Femme',
    slug: 'golden-amber-pour-femme',
    price: 78000,
    originalPrice: 90000,
    discountPercent: 13,
    category: 'Perfumes & Fragrances',
    tags: ['new_arrival', 'featured'],
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A luminous, radiant floral-amber eau de parfum opening with sparkling Italian bergamot and neroli, leading into heart notes of golden jasmine, tonka bean, and white musk.',
    specifications: {
      'Volume': '85ml',
      'Concentration': 'Eau de Parfum',
      'Scent Profile': 'Floral Amber, Bergamot, Tonka Bean',
      'Gender': 'Women'
    },
    materials: ['Cut Crystal Bottle', '24K Gold Plated Collar'],
    variations: [
      { name: 'Packaging', options: ['Standard Boutique Box', 'Deluxe Velvet Gift Box'] }
    ],
    stock: 9,
    lowStockThreshold: 2,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isActive: true,
    rating: 4.8,
    reviewCount: 11,
    isDemo: false
  }
];

export const initialStoreSettings: StoreSettings = {
  storeName: 'Le-one Jewelries',
  tagline: 'Jewelry That Makes Every Moment Special',
  phone: '+234 802 335 5789',
  whatsapp: '+234 802 335 5789',
  address: 'Aki Cube Mall, 3rd Ave, Gwarinpa Estate, Gwarinpa 900108, Federal Capital Territory, Nigeria',
  mallName: 'Aki Cube Mall, Gwarinpa',
  businessHours: 'Monday–Sunday: 9:00 AM–8:00 PM',
  googleRating: 4.7,
  googleReviewCount: 6,
  googleMapsUrl: 'https://maps.app.goo.gl/gwxcrhkxP8BgKff77',
  deliveryFees: {
    abujaStandard: 2500,
    abujaExpress: 4500,
    nationwide: 5500,
    freeDeliveryThreshold: 150000
  },
  bankDetails: {
    bankName: 'Guaranty Trust Bank (GTBank)',
    accountNumber: '0812345678',
    accountName: 'Le-one Jewelries Ltd',
    paymentInstructions: 'Please use your Full Name or Order ID as transfer narration. Click "Send Order Confirmation on WhatsApp" after placing your order to send proof of payment for immediate dispatch.',
    secondaryBankName: 'Zenith Bank Plc',
    secondaryAccountNumber: '1019283746',
    secondaryAccountName: 'Le-one Jewelries Abuja'
  },
  socialLinks: {
    instagram: 'https://instagram.com/leonejewelries',
    facebook: 'https://facebook.com/leonejewelries',
    tiktok: 'https://tiktok.com/@leonejewelries'
  },
  announcement: '✨ Free Abuja Delivery on orders over ₦150,000 | Store open daily 9am - 8pm at Aki Cube Mall, Gwarinpa ✨',
  heroHeadline: 'Jewelry That Makes Every Moment Special',
  heroSubheadline: 'Discover elegant jewelry and accessories carefully selected to add beauty, confidence and timeless style to every occasion.',
  allowGuestCheckout: true,
  enableReviews: true,
  currency: 'NGN',
  currencySymbol: '₦'
};

export const initialReviews: Review[] = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    productName: 'Classic Gold Necklace',
    customerName: 'Amina B.',
    customerLocation: 'Gwarinpa, Abuja',
    rating: 5,
    title: 'Top quality in Abuja!',
    comment: 'Visited their physical shop at Aki Cube Mall. The staff were very courteous and the necklace quality is top tier. Beautiful packaging too!',
    date: '2026-08-15',
    isVerified: true,
    isApproved: true
  },
  {
    id: 'rev-002',
    productId: 'prod-003',
    productName: 'Luxury Tennis Bracelet',
    customerName: 'Chidinma O.',
    customerLocation: 'Maitama, Abuja',
    rating: 5,
    title: 'Sparkles so brilliantly',
    comment: 'Ordered through WhatsApp and it was delivered to my house in Maitama within 2 hours. Very trustworthy Nigerian jewelry store.',
    date: '2026-08-18',
    isVerified: true,
    isApproved: true
  },
  {
    id: 'rev-003',
    productId: 'prod-004',
    productName: "Classic Women's Gold Watch",
    customerName: 'Grace E.',
    customerLocation: 'Wuse 2, Abuja',
    rating: 5,
    title: 'Stunning luxury piece',
    comment: 'The Mother of Pearl dial is even more radiant in real life. Exactly as pictured. Highly recommend Le-one Jewelries.',
    date: '2026-08-20',
    isVerified: true,
    isApproved: true
  },
  {
    id: 'rev-004',
    productId: 'prod-007',
    productName: "Men's Gold & Steel Cuban Link Bracelet",
    customerName: 'Tunde A.',
    customerLocation: 'Lekki, Lagos (Nationwide Delivery)',
    rating: 5,
    title: 'Delivered safely to Lagos',
    comment: 'Had doubts about ordering from Abuja down to Lagos, but the package arrived in 2 days intact. Heavy solid quality.',
    date: '2026-08-22',
    isVerified: true,
    isApproved: true
  },
  {
    id: 'rev-005',
    productId: 'prod-006',
    productName: 'Royal Bridal & Gala Jewelry Gift Set',
    customerName: 'Zainab M.',
    customerLocation: 'Asokoro, Abuja',
    rating: 5,
    title: 'Perfect for my wedding reception',
    comment: 'Got countless compliments on the set. Thank you Le-one Jewelries for saving my bridal look!',
    date: '2026-08-24',
    isVerified: true,
    isApproved: true
  },
  {
    id: 'rev-006',
    productId: 'prod-008',
    productName: 'Freshwater Baroque Pearl Necklace',
    customerName: 'Funke D.',
    customerLocation: 'Garki 2, Abuja',
    rating: 4,
    title: 'Lovely organic pearls',
    comment: 'Great weight and gorgeous luster on the pearls. The gold toggle clasp makes it easy to put on independently.',
    date: '2026-08-26',
    isVerified: true,
    isApproved: true
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'coup-001',
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    minOrder: 25000,
    expiresAt: '2026-12-31',
    isActive: true,
    usageCount: 28
  },
  {
    id: 'coup-002',
    code: 'ABUJA5K',
    type: 'fixed',
    value: 5000,
    minOrder: 50000,
    expiresAt: '2026-12-31',
    isActive: true,
    usageCount: 14
  },
  {
    id: 'coup-003',
    code: 'LEONEVIP',
    type: 'percent',
    value: 15,
    minOrder: 100000,
    expiresAt: '2026-12-31',
    isActive: true,
    usageCount: 9
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'LEO-2026-0001',
    customer: {
      fullName: 'Amina Bello',
      email: 'amina.bello@example.com',
      phone: '+2348031234567',
      whatsapp: '+2348031234567'
    },
    delivery: {
      method: 'abuja_express',
      methodName: 'Abuja Express Delivery',
      fee: 4500,
      address: {
        state: 'Federal Capital Territory',
        city: 'Maitama',
        address: 'Plot 412, Aguiyi Ironsi Street',
        additionalInstructions: 'Call upon arrival at the security gate'
      }
    },
    items: [
      {
        productId: 'prod-001',
        name: 'Classic Gold Necklace',
        price: 68000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
        selectedVariations: { Length: '18 inch', Color: 'Yellow Gold' }
      }
    ],
    subtotal: 68000,
    discount: 6800,
    couponCode: 'WELCOME10',
    total: 65700,
    paymentMethod: 'paystack',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    trackingNumber: 'ABJ-EXP-8891',
    notes: 'Delivered on time to client.',
    createdAt: '2026-08-25T11:30:00.000Z',
    updatedAt: '2026-08-25T14:45:00.000Z'
  },
  {
    id: 'ord-002',
    orderNumber: 'LEO-2026-0002',
    customer: {
      fullName: 'Emeka Nwosu',
      email: 'emeka.nwosu@example.com',
      phone: '+2348069876543',
      whatsapp: '+2348069876543'
    },
    delivery: {
      method: 'store_pickup',
      methodName: 'Store Pickup (Aki Cube Mall, Gwarinpa)',
      fee: 0
    },
    items: [
      {
        productId: 'prod-004',
        name: "Classic Women's Gold Watch",
        price: 95000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80',
        selectedVariations: { 'Dial Style': 'Mother of Pearl' }
      }
    ],
    subtotal: 95000,
    discount: 5000,
    couponCode: 'ABUJA5K',
    total: 90000,
    paymentMethod: 'store_payment',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    notes: 'Picked up in person at Aki Cube Mall store.',
    createdAt: '2026-08-27T14:15:00.000Z',
    updatedAt: '2026-08-27T16:00:00.000Z'
  },
  {
    id: 'ord-003',
    orderNumber: 'LEO-2026-0003',
    customer: {
      fullName: 'Folake Adeleke',
      email: 'folake.a@example.com',
      phone: '+2348123456789',
      whatsapp: '+2348123456789'
    },
    delivery: {
      method: 'nationwide',
      methodName: 'Nationwide Delivery (Outside Abuja)',
      fee: 5500,
      address: {
        state: 'Lagos State',
        city: 'Victoria Island',
        address: '14 Bishop Oluwole Street',
        additionalInstructions: 'Deliver to office reception'
      }
    },
    items: [
      {
        productId: 'prod-003',
        name: 'Luxury Tennis Bracelet',
        price: 52000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1611591475887-fa856e7e4526?auto=format&fit=crop&w=1000&q=80',
        selectedVariations: { 'Wrist Size': '7.0 inch (Standard)', Finish: 'Yellow Gold' }
      },
      {
        productId: 'prod-002',
        name: 'Elegant Crystal Drop Earrings',
        price: 35000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80',
        selectedVariations: { 'Stone Color': 'Clear Diamond' }
      }
    ],
    subtotal: 87000,
    discount: 8700,
    couponCode: 'WELCOME10',
    total: 83800,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    trackingNumber: 'GIG-NAT-44129',
    notes: 'Dispatched via logistics express.',
    createdAt: '2026-08-28T09:00:00.000Z',
    updatedAt: '2026-08-28T12:00:00.000Z'
  }
];

export interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  settings: StoreSettings;
  users: UserProfile[];
}

// Database helper functions
export function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database file, using initial data:', err);
  }

  const initialData: DatabaseSchema = {
    products: initialProducts,
    categories: initialCategories,
    orders: initialOrders,
    reviews: initialReviews,
    coupons: initialCoupons,
    settings: initialStoreSettings,
    users: []
  };

  saveDatabase(initialData);
  return initialData;
}

export function saveDatabase(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}
