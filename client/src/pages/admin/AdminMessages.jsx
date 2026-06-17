import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Trash2, Mail } from 'lucide-react';
import { contactAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contactAPI.getAll().then(({ data }) => setMessages(data)).finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await contactAPI.markRead(id);
    setMessages((prev) => prev.map((m) => m._id === id ? { ...m, isRead: true } : m));
  };

  const handleDelete = async (id) => {
    await contactAPI.delete(id);
    setMessages((prev) => prev.filter((m) => m._id !== id));
    toast.success('Message deleted');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Contact Messages</h2>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className={`card p-5 ${!msg.isRead ? 'border-l-4 border-l-secondary' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{msg.name}</span>
                  <span className="text-gray-400 text-sm flex items-center gap-1"><Mail size={12} />{msg.email}</span>
                </div>
                {msg.phone && <p className="text-sm text-gray-500 mb-2">{msg.phone}</p>}
                <p className="text-gray-600">{msg.message}</p>
                <p className="text-xs text-gray-400 mt-2">{formatDate(msg.createdAt)}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!msg.isRead && <button onClick={() => markRead(msg._id)} className="text-xs text-secondary hover:underline">Mark read</button>}
                <button onClick={() => handleDelete(msg._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-gray-400 text-center py-8">No messages</p>}
      </div>
    </div>
  );
};

export default AdminMessages;
