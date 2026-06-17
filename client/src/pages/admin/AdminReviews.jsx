import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Trash2, Star } from 'lucide-react';
import { reviewAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewAPI.getAll().then(({ data }) => setReviews(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    await reviewAPI.delete(id);
    setReviews((prev) => prev.filter((r) => r._id !== id));
    toast.success('Review deleted');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Manage Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="card p-5 flex justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{review.user?.name}</span>
                <span className="text-gray-400">on</span>
                <span className="text-secondary">{review.tour?.title}</span>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={14} className="text-accent fill-accent" />)}
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
            <button onClick={() => handleDelete(review._id)} className="text-gray-400 hover:text-red-500 shrink-0"><Trash2 size={16} /></button>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-400 text-center py-8">No reviews yet</p>}
      </div>
    </div>
  );
};

export default AdminReviews;
