import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI } from '../../services/api';
import { BOOKING_STATUS, formatDate, formatPrice } from '../../utils/helpers';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    bookingAPI.getMy().then(({ data }) => setBookings(data)).catch(() => {});
  }, []);

  const upcoming = bookings.filter((booking) => booking.status === 'confirmed' || booking.status === 'pending');
  const wishlistCount = user?.wishlist?.length || 0;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-primary">Dashboard Overview</h2>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Calendar, label: 'Total Bookings', value: bookings.length, color: 'bg-blue-50 text-blue-600' },
          { icon: MapPin, label: 'Upcoming Trips', value: upcoming.length, color: 'bg-emerald-50 text-emerald-600' },
          { icon: Heart, label: 'Wishlist Items', value: wishlistCount, color: 'bg-red-50 text-red-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card flex items-center gap-4 p-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="font-semibold text-primary">Recent Bookings</h3>
          <Link to="/dashboard/bookings" className="text-sm font-semibold text-secondary hover:text-secondary-dark">
            View all
          </Link>
        </div>
        {bookings.length === 0 ? (
          <p className="py-8 text-center text-slate-500">
            No bookings yet. <Link to="/destinations" className="font-semibold text-secondary">Explore tours</Link>
          </p>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking._id} className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{booking.tour?.title}</p>
                  <p className="text-sm text-slate-500">{formatDate(booking.travelDate)}</p>
                </div>
                <div className="sm:text-right">
                  <span className={`rounded-full px-2 py-1 text-xs ${BOOKING_STATUS[booking.status]?.color}`}>
                    {BOOKING_STATUS[booking.status]?.label}
                  </span>
                  <p className="mt-1 text-sm font-bold text-primary">{formatPrice(booking.totalPrice)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
