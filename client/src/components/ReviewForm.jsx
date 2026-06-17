import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Send, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reviewAPI } from '../services/api';

const ReviewForm = ({ tourId, onReviewAdded }) => {
  const { isAuthenticated } = useAuth();
  const [hovered, setHovered] = useState(0);
  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { rating: 5, comment: '' },
  });

  const rating = watch('rating');

  if (!isAuthenticated) {
    return (
      <div className="card p-6 text-center text-sm text-slate-500">
        <Link to="/login" className="font-semibold text-secondary hover:text-secondary-dark">Sign in</Link> to leave a review.
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      const { data: review } = await reviewAPI.create({ tourId, rating: Number(data.rating), comment: data.comment });
      toast.success('Review submitted!');
      reset();
      onReviewAdded?.(review);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-primary">Write a Review</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Your Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setValue('rating', value)}
                aria-label={`Rate ${value} stars`}
                className="rounded-lg p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                <Star
                  size={24}
                  className={(hovered || rating) >= value ? 'fill-accent text-accent' : 'text-slate-200'}
                />
              </button>
            ))}
          </div>
          <input type="hidden" {...register('rating', { required: true, min: 1, max: 5 })} />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Your Review</label>
          <textarea
            {...register('comment', { required: 'Please write a comment' })}
            rows={4}
            className="input-field resize-none"
            placeholder="Share your experience..."
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          <Send size={15} /> {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
