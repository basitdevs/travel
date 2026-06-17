import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Plane,
  Twitter,
  Youtube,
} from 'lucide-react';

const footerGroups = [
  {
    title: 'Explore',
    links: [
      { to: '/', label: 'Home' },
      { to: '/destinations', label: 'Destinations' },
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Travel Styles',
    links: [
      { to: '/destinations?category=luxury', label: 'Luxury Escapes' },
      { to: '/destinations?category=adventure', label: 'Adventure Tours' },
      { to: '/destinations?category=cultural', label: 'Cultural Trips' },
      { to: '/destinations?category=beach', label: 'Beach Retreats' },
    ],
  },
];

const Footer = () => (
  <footer className="bg-dark text-white">
    <div className="border-b border-white/10 bg-white/5">
      <div className="container flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-accent">Ready when you are</p>
          <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
            Let your next journey feel effortless.
          </h2>
        </div>
        <Link to="/contact" className="btn-secondary shrink-0">
          Speak To A Specialist <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>

    <div className="container py-12 lg:py-16">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-white" aria-label="WanderLux home">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
              <Plane size={22} />
            </span>
            <span>
              <span className="block font-display text-2xl font-semibold">WanderLux</span>
              <span className="mt-1 block text-xs font-semibold uppercase text-white/50">Travel Agency</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            Curated private tours, premium stays, and seamless support for travelers who want every detail handled well.
          </p>
          <div className="mt-6 flex gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
              <a
                key={index}
                href="#"
                aria-label="Social profile"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-secondary hover:bg-secondary hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-bold text-white">{group.title}</h3>
            <ul className="mt-5 space-y-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-secondary"
                  >
                    {link.label}
                    <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-bold text-white">Contact</h3>
          <ul className="mt-5 space-y-4">
            {[
              { icon: MapPin, text: '123 Travel Street, New York, NY 10001' },
              { icon: Phone, text: '+1 (555) 123-4567' },
              { icon: Mail, text: 'info@wanderlux.com' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-white/60">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-secondary">
                  <Icon size={15} />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} WanderLux Travel Agency. All rights reserved.</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
          <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
