import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Star } from 'lucide-react';
import { formatPrice, getImageUrl } from '../utils/helpers';

const categoryColors = {
  adventure: 'bg-coral text-white',
  beach: 'bg-cyan-500 text-white',
  cultural: 'bg-violet-500 text-white',
  luxury: 'bg-accent text-white',
  wildlife: 'bg-emerald-600 text-white',
  city: 'bg-primary-light text-white',
};

const TourCard = ({ tour, index = 0 }) => (
  <motion.article
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ delay: Math.min(index * 0.06, 0.24), duration: 0.45 }}
    className="card-premium group flex h-full flex-col"
  >
    <div className="relative h-56 overflow-hidden">
      <img
        src={getImageUrl(tour.images?.[0], 700)}
        alt={tour.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="img-overlay opacity-80" />
      <div className={`badge absolute left-4 top-4 capitalize shadow-lg ${categoryColors[tour.category] || 'bg-primary text-white'}`}>
        {tour.category || 'Tour'}
      </div>
      {tour.isFeatured && (
        <div className="badge absolute right-4 top-4 bg-white text-primary shadow-lg">
          Featured
        </div>
      )}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary">
          <Star size={13} className="fill-accent text-accent" />
          {tour.rating || 'New'}
          {tour.reviewCount > 0 && <span className="font-semibold text-slate-500">({tour.reviewCount})</span>}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-dark/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          <Clock size={13} />
          {tour.duration} days
        </span>
      </div>
    </div>

    <div className="flex flex-1 flex-col p-5">
      <div className="mb-2 flex items-center gap-1.5 text-sm text-slate-500">
        <MapPin size={14} className="shrink-0 text-secondary" />
        <span className="truncate">{tour.city}, {tour.country}</span>
      </div>
      <h3 className="font-display text-xl font-semibold leading-snug text-primary transition-colors group-hover:text-secondary">
        {tour.title}
      </h3>
      <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
        <div>
          <span className="text-xs font-bold uppercase text-slate-400">From</span>
          <p className="mt-1 text-2xl font-bold text-primary">{formatPrice(tour.price)}</p>
          <span className="text-xs text-slate-500">per person</span>
        </div>
        <Link to={`/tours/${tour._id}`} className="btn-primary px-4 py-2.5">
          View <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  </motion.article>
);

export default TourCard;
