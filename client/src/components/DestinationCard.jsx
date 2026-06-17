import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { getImageUrl } from '../utils/helpers';

const DestinationCard = ({ destination, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ delay: Math.min(index * 0.06, 0.24), duration: 0.45 }}
    className="h-full"
  >
    <Link
      to={`/destinations?search=${encodeURIComponent(destination.name)}`}
      className="card-premium group block h-full"
    >
      <div className="relative h-72 overflow-hidden">
        <img
          src={getImageUrl(destination.image, 800)}
          alt={destination.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="img-overlay" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="mb-2 flex items-center gap-1.5 text-sm text-white/80">
            <MapPin size={14} className="text-accent" />
            <span>{destination.country}{destination.city ? `, ${destination.city}` : ''}</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-white transition-colors group-hover:text-accent">
            {destination.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/70">
            {destination.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white">
            Explore tours <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default DestinationCard;
