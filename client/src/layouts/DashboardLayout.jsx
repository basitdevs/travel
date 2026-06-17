import { Link, NavLink, Outlet } from 'react-router-dom';
import { Calendar, Heart, LayoutDashboard, Plane, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { IMAGES, unsplash } from '../utils/images';

const DashboardLayout = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
    { to: '/dashboard/bookings', icon: Calendar, label: 'My Bookings' },
    { to: '/dashboard/wishlist', icon: Heart, label: 'Wishlist' },
  ];

  return (
    <div className="min-h-screen bg-light">
      <header className="relative overflow-hidden bg-dark">
        <div className="absolute inset-0">
          <img src={unsplash(IMAGES.heroAlt, 1400)} alt="" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-primary/90 to-primary/70" />
        </div>
        <div className="container relative py-8">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-accent">
                  <Plane size={21} />
                </span>
                <span className="font-display text-xl font-semibold">WanderLux</span>
              </Link>
              <span className="hidden h-8 w-px bg-white/20 sm:block" />
              <div className="hidden sm:block">
                <h1 className="font-semibold text-white">My Dashboard</h1>
                <p className="text-sm text-white/70">Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}</p>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">
              {user?.name?.[0]}
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="shrink-0 lg:w-64">
            <nav className="card p-3">
              <div className="grid gap-1">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                        isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-slate-100 hover:text-primary'
                      }`
                    }
                  >
                    <Icon size={17} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </nav>
          </aside>
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
