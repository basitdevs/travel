import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { tourAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', country: '', city: '', duration: '', price: '',
    category: 'adventure', hotelInfo: '', maxTravelers: '20', isFeatured: false, isActive: true,
    images: '', includedServices: '', excludedServices: '', availableDates: '',
  });

  const fetchTours = () => {
    tourAPI.getAll({ limit: 100, all: 'true' })
      .then(({ data }) => setTours(data.tours))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTours(); }, []);

  const resetForm = () => {
    setForm({ title: '', description: '', country: '', city: '', duration: '', price: '', category: 'adventure', hotelInfo: '', maxTravelers: '20', isFeatured: false, isActive: true, images: '', includedServices: '', excludedServices: '', availableDates: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (tour) => {
    setEditing(tour);
    setForm({
      title: tour.title, description: tour.description, country: tour.country, city: tour.city,
      duration: tour.duration, price: tour.price, category: tour.category, hotelInfo: tour.hotelInfo || '',
      maxTravelers: tour.maxTravelers, isFeatured: tour.isFeatured, isActive: tour.isActive,
      images: tour.images?.join(', ') || '',
      includedServices: tour.includedServices?.join(', ') || '',
      excludedServices: tour.excludedServices?.join(', ') || '',
      availableDates: tour.availableDates?.map((d) => d.split('T')[0]).join(', ') || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const list = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);
    const payload = {
      ...form,
      images: list(form.images),
      includedServices: list(form.includedServices),
      excludedServices: list(form.excludedServices),
      availableDates: list(form.availableDates),
    };

    try {
      if (editing) {
        await tourAPI.update(editing._id, payload);
        toast.success('Tour updated');
      } else {
        await tourAPI.create(payload);
        toast.success('Tour created');
      }
      resetForm();
      fetchTours();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tour?')) return;
    try {
      await tourAPI.delete(id);
      toast.success('Tour deleted');
      fetchTours();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Manage Tours</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Add Tour
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h3 className="font-semibold mb-4">{editing ? 'Edit Tour' : 'New Tour'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['title', 'country', 'city', 'duration', 'price', 'hotelInfo', 'maxTravelers'].map((field) => (
              <div key={field}>
                <label className="text-sm text-gray-600 capitalize">{field}</label>
                <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="input-field text-sm" required={['title', 'country', 'city', 'duration', 'price'].includes(field)} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600">Image URLs (comma separated)</label>
              <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="input-field text-sm" placeholder="https://example.com/image-1.jpg, https://example.com/image-2.jpg" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm" rows={3} required />
            </div>
            <div>
              <label className="text-sm text-gray-600">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field text-sm">
                {['adventure', 'beach', 'cultural', 'luxury', 'wildlife', 'city'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Available Dates (comma separated YYYY-MM-DD)</label>
              <input value={form.availableDates} onChange={(e) => setForm({ ...form, availableDates: e.target.value })} className="input-field text-sm" placeholder="2025-07-01, 2025-08-01" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Included Services (comma separated)</label>
              <input value={form.includedServices} onChange={(e) => setForm({ ...form, includedServices: e.target.value })} className="input-field text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Excluded Services (comma separated)</label>
              <input value={form.excludedServices} onChange={(e) => setForm({ ...form, excludedServices: e.target.value })} className="input-field text-sm" />
            </div>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary text-sm">{editing ? 'Update' : 'Create'}</button>
              <button type="button" onClick={resetForm} className="text-sm text-gray-500">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-gray-500">Title</th>
              <th className="text-left p-4 font-medium text-gray-500">Location</th>
              <th className="text-left p-4 font-medium text-gray-500">Price</th>
              <th className="text-left p-4 font-medium text-gray-500">Status</th>
              <th className="text-right p-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour._id} className="border-t border-gray-50">
                <td className="p-4 font-medium">{tour.title}</td>
                <td className="p-4 text-gray-500">{tour.city}, {tour.country}</td>
                <td className="p-4">{formatPrice(tour.price)}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${tour.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tour.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(tour)} className="p-1.5 text-gray-400 hover:text-primary"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(tour._id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTours;
