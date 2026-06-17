import { Link, NavLink, Outlet } from 'react-router-dom';
import { Calendar, Compass, LayoutDashboard, Map, MessageSquare, Plane, Star, Users } from 'lucide-react';

const AdminLayout = () => {
  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/tours', icon: Compass, label: 'Tours' },
    { to: '/admin/destinations', icon: Map, label: 'Destinations' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { to: '/admin/reviews', icon: Star, label: 'Reviews' },
    { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  ];

  return (
    <div className="min-h-screen bg-light">
      <header className="bg-dark text-white">
        <div className="container flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-accent">
                <Plane size={21} />
              </span>
              <span className="font-display text-xl font-semibold">WanderLux</span>
            </Link>
            <span className="hidden h-8 w-px bg-white/20 sm:block" />
            <span className="text-sm font-semibold text-accent">Admin Panel</span>
          </div>
          <Link to="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            Back to Site
          </Link>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="shrink-0 lg:w-60">
            <nav className="card p-3">
              <div className="grid gap-1">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                        isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-primary'
                      }`
                    }
                  >
                    <Icon size={16} />
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

export default AdminLayout;
