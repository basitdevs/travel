import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowLeft, CheckCircle, LockKeyhole, Plane } from 'lucide-react';
import { authAPI } from '../../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await authAPI.resetPassword(token, data.password);
      setDone(true);
      toast.success('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light px-5 py-10">
        <div className="card-premium w-full max-w-md p-8 text-center">
          <CheckCircle className="mx-auto mb-4 text-emerald-500" size={64} />
          <h1 className="font-display text-3xl font-semibold text-primary">Password Reset</h1>
          <p className="mt-3 text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-light px-5 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center gap-3 text-primary">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <Plane size={22} />
          </span>
          <span className="font-display text-2xl font-semibold">WanderLux</span>
        </Link>

        <div className="card-premium p-6 sm:p-8">
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <LockKeyhole size={23} />
          </span>
          <h1 className="font-display text-3xl font-semibold text-primary">Reset Password</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">Enter your new password below.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500">New Password</label>
              <input
                {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
                type="password"
                className="input-field"
                placeholder="New password"
              />
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Confirm Password</label>
              <input
                {...register('confirmPassword', { validate: (value) => value === watch('password') || 'Passwords do not match' })}
                type="password"
                className="input-field"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <Link to="/login" className="btn-ghost mt-6 w-full">
            <ArrowLeft size={16} /> Back To Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
