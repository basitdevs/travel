import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Ban, Trash2 } from 'lucide-react';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getAll().then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  }, []);

  const handleBlock = async (id) => {
    try {
      const { data } = await userAPI.block(id);
      setUsers((prev) => prev.map((u) => u._id === id ? data.user : u));
      toast.success(data.message);
    } catch {
      toast.error('Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    await userAPI.delete(id);
    setUsers((prev) => prev.filter((u) => u._id !== id));
    toast.success('User deleted');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Manage Users</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-gray-50">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-gray-500">{user.email}</td>
                <td className="p-4 capitalize">{user.role}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {user.role !== 'admin' && (
                    <>
                      <button onClick={() => handleBlock(user._id)} className="p-1.5 text-gray-400 hover:text-yellow-600" title="Block/Unblock"><Ban size={16} /></button>
                      <button onClick={() => handleDelete(user._id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
