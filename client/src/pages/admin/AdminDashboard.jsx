import { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Compass } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { formatPrice, formatDate, BOOKING_STATUS } from '../../utils/helpers';
import { StatsSkeleton } from '../../components/LoadingSkeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <StatsSkeleton />;

  const cards = [
    { icon: Users, label: 'Total Users', value: stats?.totalUsers, color: 'bg-blue-500' },
    { icon: Calendar, label: 'Total Bookings', value: stats?.totalBookings, color: 'bg-green-500' },
    { icon: DollarSign, label: 'Revenue', value: formatPrice(stats?.revenue || 0), color: 'bg-accent' },
    { icon: Compass, label: 'Active Tours', value: stats?.activeTours, color: 'bg-secondary' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon className="text-white" size={20} />
            </div>
            <p className="text-2xl font-bold text-primary">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-primary mb-4">Recent Bookings</h3>
        {stats?.recentBookings?.length === 0 ? (
          <p className="text-gray-400">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 font-medium text-gray-500">Tour</th>
                  <th className="text-left py-3 font-medium text-gray-500">User</th>
                  <th className="text-left py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentBookings?.map((b) => (
                  <tr key={b._id} className="border-b border-gray-50">
                    <td className="py-3">{b.tour?.title}</td>
                    <td className="py-3">{b.user?.name}</td>
                    <td className="py-3">{formatDate(b.createdAt)}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${BOOKING_STATUS[b.status]?.color}`}>
                        {BOOKING_STATUS[b.status]?.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
