import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { destinationAPI } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', country: '', city: '', description: '', image: '', isPopular: false });

  const fetch = () => {
    destinationAPI.getAll({ limit: 100 })
      .then(({ data }) => setDestinations(data.destinations))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, isPopular: form.isPopular };
      if (editing) {
        await destinationAPI.update(editing._id, payload);
        toast.success('Destination updated');
      } else {
        await destinationAPI.create(payload);
        toast.success('Destination created');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', country: '', city: '', description: '', image: '', isPopular: false });
      fetch();
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this destination?')) return;
    await destinationAPI.delete(id);
    toast.success('Deleted');
    fetch();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Manage Destinations</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm flex items-center gap-2"><Plus size={16} /> Add</button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['name', 'country', 'city', 'image'].map((f) => (
              <div key={f}>
                <label className="text-sm text-gray-600 capitalize">{f === 'image' ? 'Image URL' : f}</label>
                <input value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="input-field text-sm" required={f !== 'city'} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm" rows={3} required />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} /> Popular</label>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary text-sm">{editing ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-sm text-gray-500">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.map((d) => (
          <div key={d._id} className="card overflow-hidden">
            <img src={getImageUrl(d.image)} alt={d.name} className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">{d.name}</h3>
              <p className="text-sm text-gray-500">{d.country}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setEditing(d); setForm(d); setShowForm(true); }} className="text-sm text-secondary"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(d._id)} className="text-sm text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDestinations;
