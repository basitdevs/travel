import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowRight, Check, Eye, EyeOff, Plane } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { IMAGES, unsplash } from '../../utils/images';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      toast.success('Account created! Welcome to WanderLux.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="grid min-h-screen bg-light lg:grid-cols-[0.95fr_1fr]">
      <section className="relative hidden overflow-hidden bg-dark lg:block">
        <img src={unsplash(IMAGES.authRegister, 1400)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark/90 via-primary/70 to-coral/50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-accent">
              <Plane size={23} />
            </span>
            <span className="font-display text-2xl font-semibold">WanderLux</span>
          </Link>

          <div className="max-w-md">
            <span className="home-eyebrow text-accent">Start Here</span>
            <h1 className="font-display text-5xl font-semibold leading-tight text-white">
              Build your travel wishlist.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              Create an account to save tours, manage bookings, and keep your next journey organized.
            </p>
            <div className="mt-8 grid gap-3">
              {['Save favorite tours', 'Book faster', 'Manage trip details'].map((item) => (
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
          <h1 className="font-display text-4xl font-semibold text-primary">Create Account</h1>
          <p className="mt-3 text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-secondary hover:text-secondary-dark">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Full Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="input-field"
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
            </div>

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
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Min 6 characters"
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

            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Confirm Password</label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                })}
                type="password"
                className="input-field"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4">
              {isSubmitting ? 'Creating account...' : <>Create Account <ArrowRight size={17} /></>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
