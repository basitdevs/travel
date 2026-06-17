import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowRight, Check, Eye, EyeOff, Plane } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { IMAGES, unsplash } from '../../utils/images';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password, data.remember);
      toast.success('Welcome back!');
      const redirect = searchParams.get('redirect') || location.state?.from || '/';
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="grid min-h-screen bg-light lg:grid-cols-[0.95fr_1fr]">
      <section className="relative hidden overflow-hidden bg-dark lg:block">
        <img src={unsplash(IMAGES.auth, 1400)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark/90 via-primary/70 to-secondary/50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-accent">
              <Plane size={23} />
            </span>
            <span className="font-display text-2xl font-semibold">WanderLux</span>
          </Link>

          <div className="max-w-md">
            <span className="home-eyebrow text-accent">Welcome Back</span>
            <h1 className="font-display text-5xl font-semibold leading-tight text-white">
              Continue your next journey.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              Access saved tours, bookings, and trip details from your personal travel dashboard.
            </p>
            <div className="mt-8 grid gap-3">
              {['Saved wishlists', 'Secure booking history', 'Personal profile'].map((item) => (
                <span key={item} className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Check size={15} className="text-accent" /> {item}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-white/50">&copy; {new Date().getFullYear()} WanderLux Travel Agency</p>
        </div>
      </section>

      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center gap-3 text-primary lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Plane size={22} />
            </span>
            <span className="font-display text-2xl font-semibold">WanderLux</span>
          </Link>

          <span className="section-label">Account</span>
          <h1 className="font-display text-4xl font-semibold text-primary">Sign In</h1>
          <p className="mt-3 text-slate-600">
            New to WanderLux?{' '}
            <Link to="/register" className="font-semibold text-secondary hover:text-secondary-dark">
              Create an account
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
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

            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Password</label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((value) => !value)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 rounded-lg p-2 text-slate-400 transition-colors -translate-y-1/2 hover:bg-slate-100 hover:text-primary"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                <input {...register('remember')} type="checkbox" className="h-4 w-4 rounded border-slate-300 text-secondary focus:ring-secondary" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm font-semibold text-secondary hover:text-secondary-dark">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4">
              {isSubmitting ? 'Signing in...' : <>Sign In <ArrowRight size={17} /></>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
