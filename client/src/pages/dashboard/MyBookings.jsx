import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Download, X } from 'lucide-react';
import { bookingAPI } from '../../services/api';
import { formatPrice, formatDate, BOOKING_STATUS, downloadInvoice } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    bookingAPI.getMy()
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.update(id, { status: 'cancelled' });
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  const upcoming = bookings.filter((b) => ['pending', 'confirmed'].includes(b.status));
  const past = bookings.filter((b) => ['completed', 'cancelled'].includes(b.status));
  const displayed = tab === 'upcoming' ? upcoming : past;

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">My Bookings</h2>

      <div className="flex gap-2 mb-6">
        {['upcoming', 'past'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
            {t} ({t === 'upcoming' ? upcoming.length : past.length})
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400 mb-4">No {tab} bookings</p>
          <Link to="/destinations" className="btn-primary text-sm">Browse Tours</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((booking) => (
            <div key={booking._id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-primary">{booking.tour?.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${BOOKING_STATUS[booking.status]?.color}`}>
                      {BOOKING_STATUS[booking.status]?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{booking.tour?.city}, {booking.tour?.country}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span>Date: {formatDate(booking.travelDate)}</span>
                    <span>Travelers: {booking.travelers}</span>
                    <span>Invoice: {booking.invoiceNumber}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-bold text-primary">{formatPrice(booking.totalPrice)}</p>
                  <button onClick={() => downloadInvoice(booking)} className="p-2 text-gray-400 hover:text-primary" title="Download Invoice">
                    <Download size={18} />
                  </button>
                  {['pending', 'confirmed'].includes(booking.status) && (
                    <button onClick={() => handleCancel(booking._id)} className="p-2 text-gray-400 hover:text-red-500" title="Cancel">
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
