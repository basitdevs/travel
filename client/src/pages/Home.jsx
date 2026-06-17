import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Calendar,
  Check,
  Globe,
  Headphones,
  MapPin,
  Plane,
  Search,
  Shield,
  Star,
  Users,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { destinationAPI, tourAPI } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import { TourGridSkeleton } from '../components/LoadingSkeleton';
import TourCard from '../components/TourCard';
import { IMAGES, unsplash } from '../utils/images';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Home = () => {
  const navigate = useNavigate();
  const [featuredTours, setFeaturedTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    Promise.all([tourAPI.getFeatured(), destinationAPI.getPopular()])
      .then(([tours, dests]) => {
        setFeaturedTours(tours.data);
        setDestinations(dests.data.slice(0, 6));
      })
      .catch(() => toast.error('Failed to load travel collections'))
      .finally(() => setLoading(false));
  }, []);

  const onSearch = (data) => {
    const params = new URLSearchParams();
    if (data.destination) params.set('search', data.destination);
    navigate(`/destinations?${params.toString()}`);
  };

  const onNewsletter = (e) => {
    e.preventDefault();
    toast.success('Thank you for subscribing!');
    e.target.reset();
  };

  const stats = [
    { value: '50K+', label: 'Happy travelers' },
    { value: '200+', label: 'Destinations' },
    { value: '15+', label: 'Years planning' },
    { value: '4.9/5', label: 'Guest rating' },
  ];

  const features = [
    { icon: Shield, title: 'Protected Bookings', desc: 'Licensed, insured trips with clear terms and secure checkout.' },
    { icon: Award, title: 'Curated Quality', desc: 'Hotels, guides, and experiences selected for comfort and character.' },
    { icon: Headphones, title: 'Human Support', desc: 'Travel specialists available before, during, and after your journey.' },
    { icon: Globe, title: 'Global Partners', desc: 'Local experts across six continents keep every itinerary grounded.' },
  ];

  const reviews = [
    {
      name: 'Emily Richardson',
      location: 'New York',
      text: 'Our Santorini honeymoon felt effortless. Every transfer, dinner reservation, and sunset experience was handled beautifully.',
      avatar: IMAGES.avatars[0],
    },
    {
      name: 'James Kensington',
      location: 'London',
      text: 'The Swiss Alps itinerary had the right rhythm: remarkable hotels, thoughtful guides, and enough quiet time to enjoy it.',
      avatar: IMAGES.avatars[1],
    },
    {
      name: 'Maria Santos',
      location: 'Barcelona',
      text: 'WanderLux made a complex family trip feel calm. The team was responsive, practical, and genuinely attentive.',
      avatar: IMAGES.avatars[2],
    },
  ];

  return (
    <div className="bg-light">
      <section className="relative min-h-[720px] overflow-hidden bg-dark sm:min-h-[760px]">
        <div className="absolute inset-0">
          <img
            src={unsplash(IMAGES.hero, 1920)}
            alt="Scenic luxury travel route"
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-primary/75 to-dark/20" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-dark/60 to-transparent" />
        </div>

        <div className="container relative flex min-h-[720px] items-center pt-24 sm:min-h-[760px]">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl py-20">
            <span className="home-eyebrow text-accent">Luxury Travel Agency</span>
            <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
              Luxury travel, planned end to end.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-xl">
              Bespoke tours, premium stays, trusted local experts, and calm support from the first idea to the flight home.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/destinations" className="btn-secondary">
                Explore Tours <ArrowRight size={17} />
              </Link>
              <Link to="/contact" className="btn-outline">
                Talk To An Expert
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 border-t border-white/20 pt-7 sm:grid-cols-3">
              {['Secure booking', 'Expert guides', 'Tailored itineraries'].map((item) => (
                <span key={item} className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Check size={15} className="shrink-0 text-accent" /> {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container relative z-10 -mt-20">
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          onSubmit={handleSubmit(onSearch)}
          className="search-card"
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_auto]">
            <label className="relative block">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input
                {...register('destination')}
                placeholder="Where do you want to go?"
                className="input-field py-4 pl-12"
              />
            </label>
            <label className="relative block">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input
                {...register('date')}
                type="date"
                className="input-field py-4 pl-12"
              />
            </label>
            <label className="relative block">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <select {...register('travelers')} className="input-field py-4 pl-12">
                <option value="1">1 Traveler</option>
                <option value="2">2 Travelers</option>
                <option value="3">3 Travelers</option>
                <option value="4">4+ Travelers</option>
              </select>
            </label>
            <button type="submit" className="btn-primary min-h-14 px-7">
              <Search size={18} /> Search
            </button>
          </div>
        </motion.form>
      </div>

      <section className="home-section pt-24">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map(({ value, label }, index) => (
              <motion.div
                key={label}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="stat-pill"
              >
                <p className="font-display text-3xl font-semibold text-primary md:text-4xl">{value}</p>
                <p className="mt-2 text-sm text-slate-500">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="container">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="home-eyebrow">Destinations</span>
              <h2 className="home-heading">Places worth planning around</h2>
              <p className="home-subtext">
                A curated mix of coastlines, cities, mountains, and cultural routes selected for memorable travel.
              </p>
            </div>
            <Link to="/destinations" className="btn-ghost w-fit">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="skeleton h-72" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination, index) => (
                <DestinationCard key={destination._id} destination={destination} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-section surface-grid">
        <div className="container">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="home-eyebrow">Featured Tours</span>
              <h2 className="home-heading">Signature experiences</h2>
              <p className="home-subtext">
                Premium journeys with strong hotels, excellent guides, and logistics that stay out of your way.
              </p>
            </div>
            <Link to="/destinations" className="btn-ghost w-fit">
              Browse Tours <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <TourGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredTours.map((tour, index) => (
                <TourCard key={tour._id} tour={tour} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <span className="home-eyebrow">Why WanderLux</span>
              <h2 className="home-heading">Built for travelers who care about the details</h2>
              <p className="home-subtext">
                Your trip should feel exciting, not exhausting. We combine thoughtful planning with trusted local teams so every step feels considered.
              </p>
              <div className="mt-7 flex items-center gap-4 rounded-lg border border-slate-200 bg-light p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                  <Plane size={22} />
                </span>
                <div>
                  <p className="font-semibold text-primary">Private planning call included</p>
                  <p className="mt-1 text-sm text-slate-500">Start with your pace, budget, and must-see moments.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, desc }, index) => (
                <motion.div
                  key={title}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="card p-6"
                >
                  <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Icon size={22} />
                  </span>
                  <h3 className="font-semibold text-primary">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section bg-primary">
        <div className="container">
          <div className="mb-10 text-center">
            <span className="home-eyebrow justify-center text-accent">Guest Stories</span>
            <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
              Trusted by travelers worldwide
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((review, index) => (
              <motion.article
                key={review.name}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-lg border border-white/10 bg-white/10 p-6 backdrop-blur"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} size={15} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-white/80">"{review.text}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <img src={review.avatar} alt={review.name} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-white">{review.name}</p>
                    <p className="text-xs text-white/50">{review.location}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-dark py-16 md:py-20">
        <div className="absolute inset-0">
          <img
            src={unsplash(IMAGES.newsletter, 1600)}
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/80 to-primary/60" />
        </div>
        <div className="container relative">
          <div className="max-w-2xl">
            <span className="home-eyebrow text-accent">Travel Notes</span>
            <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
              Get thoughtful trip ideas in your inbox.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
              Destination guides, seasonal offers, and planning tips from the WanderLux team.
            </p>
            <form onSubmit={onNewsletter} className="mt-8 grid max-w-xl gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="input-dark"
              />
              <button type="submit" className="btn-accent">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
