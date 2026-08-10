import React, { useState } from 'react';
import { X, MessageSquare, Star, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { submitFeedback, type UserFeedback } from '../lib/supabase';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string | null;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, address }) => {
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<UserFeedback['category']>('general');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter your feedback comments');
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackData: UserFeedback = {
        wallet_address: address || undefined,
        rating,
        category,
        comment,
      };

      const success = await submitFeedback(feedbackData);
      if (success) {
        toast.success('Thank you! Your feedback has been recorded in Supabase telemetry.');
        setComment('');
        onClose();
      } else {
        toast.error('Failed to submit feedback. Please try again.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error recording feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md h-full p-6 sm:p-8 border-l border-white/10 shadow-2xl relative space-y-6 bg-[#050505] flex flex-col justify-between overflow-y-auto">
        
        {/* Top Content */}
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/30 flex items-center justify-center text-[#FF5733]">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-bebas text-2xl text-white tracking-wide">User Telemetry & Feedback</h3>
                <p className="text-gray-400 text-xs tracking-wider uppercase">Level 4 Compliance Telemetry</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Rating Stars */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase">
                Rate your SubStellar Web3 UX
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-lg border transition-all duration-300 ${
                      rating >= star
                        ? 'bg-[#FF5733]/20 border-[#FF5733] text-[#FF5733]'
                        : 'bg-white/5 border-white/10 text-gray-600 hover:text-white'
                    }`}
                  >
                    <Star size={18} fill={rating >= star ? '#FF5733' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as UserFeedback['category'])}
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF5733] rounded-lg px-4 py-3 text-xs text-white focus:outline-none transition-colors"
              >
                <option value="general" className="bg-[#050505]">General Experience</option>
                <option value="ux" className="bg-[#050505]">UI / Voxel Aesthetic</option>
                <option value="feature" className="bg-[#050505]">Feature Request</option>
                <option value="bug" className="bg-[#050505]">Bug Report</option>
              </select>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase">
                Comments & Suggestions
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your thoughts on the Soroban pull payment UX..."
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF5733] rounded-lg px-4 py-3 text-xs text-white focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF5733] hover:bg-[#E04C2C] text-white text-[11px] font-bold tracking-[0.15em] py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 uppercase shadow-xl shadow-[#FF5733]/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Send size={14} /> Submit Feedback
                </>
              )}
            </button>

          </form>
        </div>

        {/* Footer Note */}
        <div className="text-[11px] text-gray-500 font-light border-t border-white/10 pt-4 text-center">
          Feedback submissions write directly to the Supabase <code className="text-gray-400">feedback</code> telemetry table.
        </div>

      </div>
    </div>
  );
};
