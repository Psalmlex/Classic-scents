import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Search, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { formatNaira, getWhatsAppUrl } from '../../utils/formatters.ts';

export type ShippingStage = 'Processing' | 'Shipped' | 'Delivered';

export interface TrackingRecord {
  orderId: string;
  stage: ShippingStage;
  item: string;
  itemPrice: number;
  quantity: number;
  recipientName: string;
  destination: string;
  carrier: string;
  trackingCode: string;
  orderDate: string;
  estimatedDelivery: string;
  statusDescription: string;
  timeline: {
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }[];
}

// Curated dummy orders representing each of the 3 shipping stages
const DUMMY_ORDERS: Record<string, TrackingRecord> = {
  'LEONE-101': {
    orderId: 'LEONE-101',
    stage: 'Processing',
    item: '18K Yellow Gold Clover Diamond Pendant Necklace',
    itemPrice: 185000,
    quantity: 1,
    recipientName: 'Amina Bello',
    destination: 'Wuse 2 District, Abuja, FCT',
    carrier: 'Abuja Priority Boutique Dispatch',
    trackingCode: 'ABJ-PRC-7721',
    orderDate: 'Today, 09:30 AM',
    estimatedDelivery: 'Tomorrow by 3:00 PM',
    statusDescription: 'Your jewelry has been hand-selected and is undergoing final gemstone verification and luxury gift box preparation at Aki Cube Mall.',
    timeline: [
      {
        title: 'Order Confirmed',
        description: 'Payment verified and order registered at Aki Cube Mall boutique',
        timestamp: 'Today, 09:35 AM',
        completed: true,
      },
      {
        title: 'Boutique Inspection & Packing',
        description: 'Jeweler inspection, authenticity card issue, and velvet pouch packaging',
        timestamp: 'Today, 11:20 AM',
        completed: true,
      },
      {
        title: 'Dispatch with Courier',
        description: 'Scheduled for courier pickup for door-to-door delivery',
        timestamp: 'Pending Handover',
        completed: false,
      },
      {
        title: 'Delivered to Recipient',
        description: 'Direct delivery with recipient identity confirmation',
        timestamp: 'Estimated: Tomorrow afternoon',
        completed: false,
      }
    ]
  },
  'LEONE-102': {
    orderId: 'LEONE-102',
    stage: 'Shipped',
    item: 'Luxury Moissanite Tennis Bracelet (18K White Gold Plated)',
    itemPrice: 240000,
    quantity: 1,
    recipientName: 'Dr. Chidi Okafor',
    destination: 'Maitama District, Abuja, FCT',
    carrier: 'Abuja Same-Day Express Courier',
    trackingCode: 'EXP-ABJ-8942',
    orderDate: 'Yesterday, 02:15 PM',
    estimatedDelivery: 'Today by 5:30 PM (In Transit)',
    statusDescription: 'Your package is in transit with our Abuja dedicated priority courier driver, en route to your specified delivery address.',
    timeline: [
      {
        title: 'Order Confirmed',
        description: 'Order placed & insured shipping allocated',
        timestamp: 'Yesterday, 02:20 PM',
        completed: true,
      },
      {
        title: 'Packaged at Aki Cube Mall',
        description: 'Sealed with tamper-evident security tape',
        timestamp: 'Yesterday, 05:45 PM',
        completed: true,
      },
      {
        title: 'Handed to Courier Driver',
        description: 'Dispatched with priority driver on Maitama route',
        timestamp: 'Today, 12:15 PM',
        completed: true,
      },
      {
        title: 'Delivered to Recipient',
        description: 'Recipient signature and physical hand-off',
        timestamp: 'Expected today before 5:30 PM',
        completed: false,
      }
    ]
  },
  'LEONE-103': {
    orderId: 'LEONE-103',
    stage: 'Delivered',
    item: 'Royal Sapphire & Diamond Pavé Drop Earrings',
    itemPrice: 320000,
    quantity: 1,
    recipientName: 'Zainab Al-Hassan',
    destination: 'Guzape Hills Estate, Abuja, FCT',
    carrier: 'Le-one White-Glove Concierge Delivery',
    trackingCode: 'DLV-ABJ-3109',
    orderDate: '2 days ago',
    estimatedDelivery: 'Delivered (Yesterday at 4:18 PM)',
    statusDescription: 'Package successfully hand-delivered and verified with signature at Guzape Hills, Abuja.',
    timeline: [
      {
        title: 'Order Confirmed',
        description: 'Direct VIP order authenticated',
        timestamp: '2 days ago, 10:00 AM',
        completed: true,
      },
      {
        title: 'Packaged & Certified',
        description: 'Inspection card signed by master jeweler',
        timestamp: '2 days ago, 02:30 PM',
        completed: true,
      },
      {
        title: 'Dispatched from Aki Cube Mall',
        description: 'Assigned to concierge delivery route',
        timestamp: 'Yesterday, 01:10 PM',
        completed: true,
      },
      {
        title: 'Successfully Delivered',
        description: 'Signed for by Z. Al-Hassan (Recipient)',
        timestamp: 'Yesterday, 04:18 PM',
        completed: true,
      }
    ]
  }
};

// Generates fallback tracking data for any other order ID input by user
const generateFallbackOrder = (orderId: string): TrackingRecord => {
  const clean = orderId.trim().toUpperCase();
  const stages: ShippingStage[] = ['Processing', 'Shipped', 'Delivered'];
  
  // Calculate deterministic index
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const stageIndex = Math.abs(hash) % 3;
  const stage = stages[stageIndex];

  return {
    orderId: clean,
    stage,
    item: 'Curated Fine Jewelry Selection (Le-one Signature Box)',
    itemPrice: 195000,
    quantity: 1,
    recipientName: 'Valued Client',
    destination: 'Abuja Municipal Area Council, FCT, Nigeria',
    carrier: 'Abuja Express Dispatch Logistics',
    trackingCode: `TRK-${Math.abs(hash % 90000 + 10000)}`,
    orderDate: 'Recently Placed',
    estimatedDelivery: stage === 'Delivered' ? 'Delivered safely to address' : '1–2 Business Days',
    statusDescription: stage === 'Processing'
      ? 'Order is being verified and prepared with luxury gift presentation at Aki Cube Mall, Gwarinpa.'
      : stage === 'Shipped'
      ? 'Dispatched with our Abuja courier service and currently in transit.'
      : 'Package has reached destination and completed delivery verification.',
    timeline: [
      {
        title: 'Order Confirmed',
        description: 'Payment authorized and order processed',
        timestamp: 'Day 1',
        completed: true,
      },
      {
        title: 'Quality Check & Packing',
        description: 'Hand-inspected by boutique gemologist',
        timestamp: 'Day 1',
        completed: stage === 'Processing' || stage === 'Shipped' || stage === 'Delivered',
      },
      {
        title: 'Courier Dispatch',
        description: 'In transit with delivery rider',
        timestamp: stage === 'Processing' ? 'Pending' : 'Day 2',
        completed: stage === 'Shipped' || stage === 'Delivered',
      },
      {
        title: 'Delivered',
        description: 'Handed to recipient',
        timestamp: stage === 'Delivered' ? 'Completed' : 'Upcoming',
        completed: stage === 'Delivered',
      }
    ]
  };
};

interface OrderTrackingStatusProps {
  initialOrderId?: string;
  className?: string;
}

export const OrderTrackingStatus: React.FC<OrderTrackingStatusProps> = ({ 
  initialOrderId = '', 
  className = '' 
}) => {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [activeTracking, setActiveTracking] = useState<TrackingRecord | null>(
    initialOrderId ? (DUMMY_ORDERS[initialOrderId.trim().toUpperCase()] || generateFallbackOrder(initialOrderId)) : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderIdInput.trim().toUpperCase();
    if (!cleanId) {
      setError('Please enter an Order ID or reference code.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Realistic brief latency for searching
    setTimeout(() => {
      const match = DUMMY_ORDERS[cleanId] || generateFallbackOrder(cleanId);
      setActiveTracking(match);
      setIsLoading(false);
    }, 350);
  };

  const handleSelectDemoOrder = (id: string) => {
    setOrderIdInput(id);
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setActiveTracking(DUMMY_ORDERS[id]);
      setIsLoading(false);
    }, 250);
  };

  const handleReset = () => {
    setActiveTracking(null);
    setOrderIdInput('');
    setError('');
  };

  // Helper to determine stage step status
  const getStageStep = (stage: ShippingStage) => {
    switch (stage) {
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = activeTracking ? getStageStep(activeTracking.stage) : 0;

  return (
    <div id="order-tracking-status-container" className={`space-y-6 ${className}`}>
      
      {/* Search / Lookup Input Box */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8860B]">
              <Package className="w-4 h-4 text-[#D4AF37]" />
              <span>Real-Time Shipment Tracking</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-neutral-900 tracking-tight">
              Track Your Order Status
            </h3>
            <p className="text-xs text-neutral-500 max-w-xl">
              Enter your boutique order reference to view current shipping stage (Processing, Shipped, or Delivered).
            </p>
          </div>

          {activeTracking && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Track Another Order</span>
            </button>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleTrackSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Search className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <input
                id="order-tracking-input"
                type="text"
                value={orderIdInput}
                onChange={(e) => {
                  setOrderIdInput(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter Order ID (e.g. LEONE-101, LEONE-102, LEONE-103)..."
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-mono uppercase tracking-wider text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all"
              />
            </div>

            <button
              id="order-tracking-submit-btn"
              type="submit"
              disabled={isLoading || !orderIdInput.trim()}
              className="px-6 py-3 bg-neutral-900 hover:bg-[#B8860B] active:bg-[#9a7008] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Checking Status...</span>
                </>
              ) : (
                <>
                  <span>Track Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Quick Demo Order Chips */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span className="font-medium text-neutral-700">Quick Test Samples:</span>
          <button
            type="button"
            onClick={() => handleSelectDemoOrder('LEONE-101')}
            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md font-mono text-[11px] font-semibold border border-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Preview Processing stage"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>LEONE-101 (Processing)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectDemoOrder('LEONE-102')}
            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md font-mono text-[11px] font-semibold border border-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Preview Shipped stage"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>LEONE-102 (Shipped)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectDemoOrder('LEONE-103')}
            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md font-mono text-[11px] font-semibold border border-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Preview Delivered stage"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>LEONE-103 (Delivered)</span>
          </button>
        </div>
      </div>

      {/* Active Tracking Result */}
      {activeTracking && (
        <div 
          id="tracking-result-card" 
          className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* Top Status Header */}
          <div className="bg-neutral-900 text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg sm:text-xl font-bold text-[#D4AF37]">
                  {activeTracking.orderId}
                </span>
                <span className="text-neutral-400 text-xs">• Tracking #{activeTracking.trackingCode}</span>
              </div>
              <p className="text-xs text-neutral-300">
                Placed on {activeTracking.orderDate} • Carrier: {activeTracking.carrier}
              </p>
            </div>

            {/* Current Shipping Stage Badge */}
            <div className="self-start sm:self-auto">
              {activeTracking.stage === 'Processing' && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4 animate-spin-slow" />
                  <span>Stage: Processing</span>
                </div>
              )}
              {activeTracking.stage === 'Shipped' && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
                  <Truck className="w-4 h-4 animate-bounce" />
                  <span>Stage: Shipped / In Transit</span>
                </div>
              )}
              {activeTracking.stage === 'Delivered' && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Stage: Delivered</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* The 3-Stage Progress Stepper */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                Shipping Stages
              </h4>
              
              <div className="relative pt-2 pb-4">
                {/* Connecting Track Line */}
                <div className="absolute top-7 left-8 right-8 h-1 bg-neutral-200 -translate-y-1/2 z-0 hidden sm:block">
                  <div 
                    className="h-full bg-[#D4AF37] transition-all duration-500"
                    style={{
                      width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'
                    }}
                  />
                </div>

                {/* 3 Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                  
                  {/* Stage 1: Processing */}
                  <div className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all shrink-0 ${
                        currentStep >= 1
                          ? currentStep === 1
                            ? 'bg-amber-500 text-white ring-4 ring-amber-500/20 shadow-md'
                            : 'bg-[#D4AF37] text-neutral-950 shadow-xs'
                          : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                      }`}
                    >
                      {currentStep > 1 ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Package className="w-5 h-5" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className={`text-sm font-bold ${currentStep >= 1 ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        1. Processing
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {currentStep === 1 ? 'Active • Preparing in Boutique' : 'Inspection complete'}
                      </p>
                    </div>
                  </div>

                  {/* Stage 2: Shipped */}
                  <div className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all shrink-0 ${
                        currentStep >= 2
                          ? currentStep === 2
                            ? 'bg-blue-600 text-white ring-4 ring-blue-600/20 shadow-md'
                            : 'bg-[#D4AF37] text-neutral-950 shadow-xs'
                          : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                      }`}
                    >
                      {currentStep > 2 ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Truck className="w-5 h-5" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className={`text-sm font-bold ${currentStep >= 2 ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        2. Shipped
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {currentStep === 2 ? 'Active • On Delivery Route' : currentStep > 2 ? 'Dispatched & Transported' : 'Upcoming courier hand-off'}
                      </p>
                    </div>
                  </div>

                  {/* Stage 3: Delivered */}
                  <div className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all shrink-0 ${
                        currentStep >= 3
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-600/20 shadow-md'
                          : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                      }`}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <p className={`text-sm font-bold ${currentStep >= 3 ? 'text-emerald-700' : 'text-neutral-400'}`}>
                        3. Delivered
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {currentStep >= 3 ? 'Package Safely Received' : 'Pending final hand-over'}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Status Banner Message */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-neutral-800 text-xs leading-relaxed flex items-start gap-3">
                <div className="p-1 rounded bg-[#D4AF37] text-white shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="font-semibold text-neutral-900 block mb-0.5">
                    Latest Shipping Update:
                  </strong>
                  <span>{activeTracking.statusDescription}</span>
                </div>
              </div>
            </div>

            {/* Shipment Key Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-4 border-t border-neutral-200">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1">
                <span className="text-neutral-500 text-[11px] uppercase font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#B8860B]" />
                  Destination
                </span>
                <p className="font-semibold text-neutral-900">{activeTracking.recipientName}</p>
                <p className="text-neutral-600 text-[11px]">{activeTracking.destination}</p>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1">
                <span className="text-neutral-500 text-[11px] uppercase font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
                  Estimated Arrival
                </span>
                <p className="font-semibold text-neutral-900">{activeTracking.estimatedDelivery}</p>
                <p className="text-neutral-600 text-[11px]">Via {activeTracking.carrier}</p>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1 sm:col-span-2 lg:col-span-1">
                <span className="text-neutral-500 text-[11px] uppercase font-bold flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-[#B8860B]" />
                  Ordered Item
                </span>
                <p className="font-semibold text-neutral-900 truncate">{activeTracking.item}</p>
                <p className="text-[#B8860B] font-mono font-bold text-[11px]">
                  {formatNaira(activeTracking.itemPrice)}
                </p>
              </div>
            </div>

            {/* Timeline Log */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                Tracking Activity Log
              </h4>
              <div className="space-y-3">
                {activeTracking.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="mt-0.5">
                      {step.completed ? (
                        <div className="w-4 h-4 rounded-full bg-[#D4AF37] text-neutral-950 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-neutral-300 bg-neutral-100" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                        <span className={`font-semibold ${step.completed ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Support Helper */}
            <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-neutral-500 text-center sm:text-left">
                Need concierge help or want to adjust your Abuja delivery address?
              </span>
              <a
                href={getWhatsAppUrl(`Hello Le-one Jewelries, I am inquiring about tracking status for order ${activeTracking.orderId}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold rounded-lg transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat Concierge about Order</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
