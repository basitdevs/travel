import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowLeft, Mail, Plane } from 'lucide-react';
import { authAPI } from '../../services/api';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await authAPI.forgotPassword(data.email);
      toast.success('If an account exists, a reset link has been sent to your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    }
  };

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
            <Mail size={23} />
          </span>
          <h1 className="font-display text-3xl font-semibold text-primary">Forgot Password</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Enter your email and we will send a reset link if the account exists.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Email Address</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="input-field"
                placeholder="your@email.com"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
