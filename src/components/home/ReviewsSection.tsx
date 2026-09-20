import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle, Sparkles, MapPin, X } from 'lucide-react';
import { Review } from '../../types/index.ts';
import { formatDate } from '../../utils/formatters.ts';
import { apiService } from '../../services/api.ts';

interface ReviewsSectionProps {
  reviews: Review[];
  googleRating?: number;
  googleReviewCount?: number;
  onReviewAdded?: (review: Review) => void;
  onNewReviewAdded?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews = [],
  googleRating = 4.7,
  googleReviewCount = 6,
  onReviewAdded,
  onNewReviewAdded
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerLocation: 'Abuja, Nigeria',
    rating: 5,
    title: '',
    comment: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.comment) return;

    setSubmitting(true);
    try {
      const newRev = await apiService.submitReview(formData);
      setSuccessMsg('Thank you! Your verified review has been submitted.');
      if (onReviewAdded) onReviewAdded(newRev);
      if (onNewReviewAdded) onNewReviewAdded();
      setTimeout(() => {
        setModalOpen(false);
        setSuccessMsg('');
        setFormData({
          customerName: '',
          customerLocation: 'Abuja, Nigeria',
          rating: 5,
          title: '',
          comment: ''
        });
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews-section" className="py-16 sm:py-24 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 pb-6 border-b border-neutral-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Satisfaction</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Real Experiences & Reviews
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl">
              Authentic feedback from our esteemed customers in Abuja and nationwide across Nigeria.
            </p>
          </div>

          {/* Rating Snapshot & Write Review CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="p-4 bg-neutral-800/80 rounded-xl border border-neutral-700/80 flex items-center gap-4">
              <div className="text-3xl font-serif font-bold text-white">
                {(googleRating ?? 4.7).toFixed(1)}
              </div>
              <div className="space-y-0.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-neutral-400">Based on {googleReviewCount} Google Reviews</p>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 transition-all flex items-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-neutral-800/50 border border-neutral-800 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Rating & Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-600'}`}
                      />
                    ))}
                  </div>
                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-serif text-base font-bold text-white line-clamp-1">
                  "{rev.title || 'Exceptional jewelry experience'}"
                </h4>

                {/* Comment */}
                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Location */}
              <div className="pt-4 border-t border-neutral-700/60 flex items-center justify-between text-xs text-neutral-400">
                <div>
                  <p className="font-semibold text-white">{rev.customerName}</p>
                  {rev.customerLocation && (
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                      {rev.customerLocation}
                    </p>
                  )}
                </div>
                <span className="text-[11px] text-neutral-500">{formatDate(rev.date)}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs" onClick={() => setModalOpen(false)} />

          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg bg-neutral-900 text-white rounded-2xl border border-neutral-700 p-6 sm:p-8 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-2xl font-bold mb-1">Share Your Experience</h3>
              <p className="text-xs text-neutral-400 mb-6">
                Tell fellow jewelry lovers about your purchase from Le-one Jewelries Abuja.
              </p>

              {successMsg ? (
                <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-sm text-center">
                  {successMsg}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-neutral-400 ml-2">{formData.rating} / 5 Stars</span>
                    </div>
                  </div>

                  {/* Name & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Zainab A."
                        value={formData.customerName}
                        onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                        Location / City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Gwarinpa, Abuja"
                        value={formData.customerLocation}
                        onChange={e => setFormData({ ...formData, customerLocation: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Review Title */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gorgeous necklace, rapid delivery in Abuja"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write about the quality, packaging, physical store visit, or delivery experience..."
                      value={formData.comment}
                      onChange={e => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#B8860B] text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    {submitting ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
