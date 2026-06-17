import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { bookingAPI } from '../../services/api';
import { formatPrice, formatDate, BOOKING_STATUS } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getAll().then(({ data }) => setBookings(data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await bookingAPI.update(id, { status });
      setBookings((prev) => prev.map((b) => b._id === id ? data : b));
      toast.success(`Booking ${status}`);
    } catch {
      toast.error('Update failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Manage Bookings</h2>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Tour</th>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t border-gray-50">
                  <td className="p-4">{b.tour?.title}</td>
                  <td className="p-4 text-gray-500">{b.user?.name}</td>
                  <td className="p-4">{formatDate(b.travelDate)}</td>
                  <td className="p-4 font-medium">{formatPrice(b.totalPrice)}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${BOOKING_STATUS[b.status]?.color}`}>
                      {BOOKING_STATUS[b.status]?.label}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    {b.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(b._id, 'confirmed')} className="text-xs bg-green-500 text-white px-2 py-1 rounded">Approve</button>
                        <button onClick={() => updateStatus(b._id, 'cancelled')} className="text-xs bg-red-500 text-white px-2 py-1 rounded">Reject</button>
                      </>
                    )}
                    {b.status === 'confirmed' && (
                      <button onClick={() => updateStatus(b._id, 'completed')} className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Complete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
