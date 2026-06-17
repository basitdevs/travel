import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/helpers';

const avatarFallback = (name = 'User') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=113f67&color=fff`;

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [changingPass, setChangingPass] = useState(false);

  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      avatar: user?.avatar || '',
    },
  });

  const passForm = useForm();
  const avatarUrl = watch('avatar');
  const preview = avatarUrl ? getImageUrl(avatarUrl) : avatarFallback(user?.name);

  const onUpdateProfile = async (data) => {
    try {
      const { data: updated } = await userAPI.updateProfile(data);
      updateUser({ ...user, ...updated });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const onChangePassword = async (data) => {
    try {
      await userAPI.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed!');
      setChangingPass(false);
      passForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">My Profile</h2>

      <div className="card p-6 mb-6">
        <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10">
              <img src={preview} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user?.name}</h3>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Name</label>
              <input {...register('name')} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
              <input {...register('email')} type="email" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Phone</label>
              <input {...register('phone')} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Avatar Image URL</label>
              <input {...register('avatar')} className="input-field" placeholder="https://example.com/avatar.jpg" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-primary">Change Password</h3>
          {!changingPass && <button onClick={() => setChangingPass(true)} className="text-sm text-secondary hover:underline">Change</button>}
        </div>
        {changingPass && (
          <form onSubmit={passForm.handleSubmit(onChangePassword)} className="space-y-4 max-w-md">
            <input {...passForm.register('currentPassword', { required: true })} type="password" placeholder="Current password" className="input-field" />
            <input {...passForm.register('newPassword', { required: true, minLength: 6 })} type="password" placeholder="New password" className="input-field" />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary text-sm">Update Password</button>
              <button type="button" onClick={() => setChangingPass(false)} className="text-sm text-gray-500">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
