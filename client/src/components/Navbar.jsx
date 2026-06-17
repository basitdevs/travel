import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Menu, Plane, Shield, UserRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isSolid = scrolled || !isHome || open;
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const brandColor = isSolid ? 'text-primary' : 'text-white';
  const mutedColor = isSolid ? 'text-slate-500' : 'text-white/70';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isSolid
          ? 'border-b border-slate-200/80 bg-white/95 shadow-lg shadow-slate-900/5 backdrop-blur-xl'
          : 'border-b border-white/10 bg-transparent'
      }`}
    >
      <nav className="container">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link to="/" className={`group flex items-center gap-3 ${brandColor}`} aria-label="WanderLux home">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
                isSolid ? 'bg-secondary/10 text-secondary' : 'bg-white/10 text-accent'
              }`}
            >
              <Plane size={22} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-xl font-semibold">WanderLux</span>
              <span className={`mt-1 hidden text-[11px] font-semibold uppercase sm:block ${mutedColor}`}>
                Travel Agency
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isActive(link.to)
                    ? isSolid
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-primary'
                    : isSolid
                      ? 'text-slate-600 hover:bg-slate-100 hover:text-primary'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`btn-ghost ${isSolid ? '' : 'text-white hover:bg-white/10'}`}
                  >
                    <Shield size={16} /> Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className={`btn-ghost ${isSolid ? '' : 'text-white hover:bg-white/10'}`}
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <div
                  className={`flex max-w-44 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                    isSolid ? 'bg-slate-100 text-primary' : 'bg-white/10 text-white'
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                    {user?.name?.[0] || <UserRound size={14} />}
                  </span>
                  <span className="truncate">{user?.name?.split(' ')[0] || 'Traveler'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Logout"
                  className={`rounded-lg p-3 transition-colors ${
                    isSolid ? 'text-slate-500 hover:bg-slate-100 hover:text-primary' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isSolid ? 'text-slate-600 hover:bg-slate-100 hover:text-primary' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-secondary px-5 py-2.5">
                  Plan A Trip
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={`rounded-lg p-2.5 transition-colors lg:hidden ${
              isSolid ? 'text-primary hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-slate-200 bg-white shadow-xl shadow-slate-900/10 lg:hidden"
          >
            <div className="container py-4">
              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive(link.to)
                        ? 'bg-primary text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4">
                {isAuthenticated ? (
                  <div className="grid gap-2">
                    <Link to="/dashboard" className="btn-ghost justify-start">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="btn-ghost justify-start">
                        <Shield size={16} /> Admin
                      </Link>
                    )}
                    <button type="button" onClick={handleLogout} className="btn-ghost justify-start text-left">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Link to="/login" className="btn-ghost border border-slate-200">
                      Sign In
                    </Link>
                    <Link to="/register" className="btn-secondary">
                      Plan A Trip
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
