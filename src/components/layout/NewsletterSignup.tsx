import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already_subscribed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Local email validation helper
  const validateEmail = (val: string): { isValid: boolean; message: string } => {
    const trimmed = val.trim();
    if (!trimmed) {
      return { isValid: false, message: 'Please enter your email address.' };
    }

    // Standard RFC-compliant practical email validation pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    
    if (!emailRegex.test(trimmed)) {
      return { isValid: false, message: 'Please enter a valid email address (e.g., name@example.com).' };
    }

    // Ensure domain has at least a 2-character top-level domain
    const parts = trimmed.split('@');
    if (parts.length === 2) {
      const domainParts = parts[1].split('.');
      const tld = domainParts[domainParts.length - 1];
      if (!tld || tld.length < 2) {
        return { isValid: false, message: 'Please provide a valid top-level domain.' };
      }
    }

    return { isValid: true, message: '' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validation = validateEmail(email);
    if (!validation.isValid) {
      setErrorMessage(validation.message);
      setStatus('idle');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    setStatus('loading');

    // Simulate quick feedback and save to local storage
    setTimeout(() => {
      try {
        const stored = localStorage.getItem('leone_newsletter_subscribers');
        const subscribers: Array<{ email: string; subscribedAt: string }> = stored ? JSON.parse(stored) : [];
        
        const exists = subscribers.some(s => s.email.toLowerCase() === cleanEmail);
        if (exists) {
          setStatus('already_subscribed');
          return;
        }

        // Save new subscriber
        subscribers.push({
          email: cleanEmail,
          subscribedAt: new Date().toISOString()
        });
        localStorage.setItem('leone_newsletter_subscribers', JSON.stringify(subscribers));
        setStatus('success');
      } catch (err) {
        // Fallback for private mode or storage restrictions
        setStatus('success');
      }
    }, 450);
  };

  const handleReset = () => {
    setEmail('');
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <div id="newsletter-signup-card" className={`relative rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-8 backdrop-blur-sm ${className}`}>
      {/* Subtle gold accent border effect */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent rounded-t-2xl pointer-events-none" />

      {status === 'success' ? (
        <div className="py-2 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Subscription Confirmed</span>
            </div>
            <h4 className="font-serif text-xl font-bold text-white">
              Welcome to the Le-one Circle
            </h4>
            <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
              We have added <span className="text-amber-200 font-mono font-medium">{email.trim()}</span> to our VIP dispatch. You will receive private previews of new Abuja arrivals and members-only promotional privileges.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-neutral-400 hover:text-[#D4AF37] transition-colors underline cursor-pointer"
            >
              Subscribe another email address
            </button>
          </div>
        </div>
      ) : status === 'already_subscribed' ? (
        <div className="py-2 text-center space-y-4 animate-in fade-in duration-300">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          
          <div className="space-y-1.5">
            <h4 className="font-serif text-xl font-bold text-white">
              You're Already Subscribed!
            </h4>
            <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
              <span className="text-amber-200 font-mono font-medium">{email.trim()}</span> is already on our active promotional list. Keep an eye on your inbox for upcoming boutique private sales.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-neutral-400 hover:text-[#D4AF37] transition-colors underline cursor-pointer"
            >
              Enter a different email
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[#D4AF37] text-[11px] font-semibold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                VIP Promotional Updates
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Join the Le-one Private Circle
              </h4>
            </div>
            <span className="text-xs text-neutral-400">
              Receive 10% off your next luxury selection
            </span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
            Subscribe for early access to curated high-jewelry drops, boutique restocks at Aki Cube Mall, and exclusive Nigerian holiday discounts delivered directly to your inbox.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4 text-[#D4AF37]/70" />
                </div>
                <input
                  id="newsletter-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your personal or business email..."
                  aria-label="Email address for newsletter"
                  className={`w-full pl-10 pr-4 py-3 bg-neutral-950 border ${
                    errorMessage ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-neutral-700 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20'
                  } rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all`}
                  disabled={status === 'loading'}
                />
              </div>

              <button
                id="newsletter-submit-btn"
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b89528] active:bg-[#9d7d1f] text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Error Message with Local Validation Guidance */}
            {errorMessage && (
              <div className="flex items-center gap-2 text-rose-400 text-xs pt-1 animate-in fade-in duration-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>

          <div className="flex flex-wrap items-center justify-between gap-y-2 pt-1 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              No spam. Unsubscribe anytime with 1 click.
            </span>
            <span className="text-neutral-400">
              Verified Abuja Boutique Newsletter
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
