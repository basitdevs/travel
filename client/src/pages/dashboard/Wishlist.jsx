import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TourCard from '../../components/TourCard';
import { TourGridSkeleton } from '../../components/LoadingSkeleton';

const Wishlist = () => {
  const { refreshProfile } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getProfile()
      .then(({ data }) => setTours(data.wishlist || []))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (tourId) => {
    await userAPI.toggleWishlist(tourId);
    setTours((prev) => prev.filter((t) => t._id !== tourId));
    refreshProfile();
  };

  if (loading) return <TourGridSkeleton count={3} />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">My Wishlist</h2>

      {tours.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400 mb-4">Your wishlist is empty</p>
          <Link to="/destinations" className="btn-primary text-sm">Explore Tours</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour, i) => (
            <div key={tour._id} className="relative">
              <TourCard tour={tour} index={i} />
              <button onClick={() => handleRemove(tour._id)} className="absolute top-3 left-3 bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-50">
                <Heart size={16} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
