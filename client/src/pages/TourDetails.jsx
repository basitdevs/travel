import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Hotel,
  MapPin,
  Shield,
  Star,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import ReviewForm from '../components/ReviewForm';
import { useAuth } from '../context/AuthContext';
import { bookingAPI, reviewAPI, tourAPI, userAPI } from '../services/api';
import { formatDate, formatPrice, getImageUrl } from '../utils/helpers';
import { IMAGES } from '../utils/images';

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshProfile } = useAuth();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ travelDate: '', travelers: 1, specialRequests: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    Promise.all([tourAPI.getById(id), reviewAPI.getByTour(id)])
      .then(([tourRes, reviewRes]) => {
        setTour(tourRes.data);
        setReviews(reviewRes.data);
        if (tourRes.data.availableDates?.length) {
          setBooking((current) => ({ ...current, travelDate: tourRes.data.availableDates[0].split('T')[0] }));
        }
      })
      .catch(() => toast.error('Tour not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.wishlist) {
      setInWishlist(user.wishlist.some((item) => (item._id || item) === id));
    }
  }, [user, id]);

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to book a tour');
      navigate('/login', { state: { from: `/tours/${id}` } });
      return;
    }

    if (!booking.travelDate) {
      toast.error('Please select a travel date');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingAPI.create({ tourId: id, ...booking, travelers: Number(booking.travelers) });
      toast.success('Booking confirmed! Check your email.');
      navigate('/dashboard/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to save tours');
      return;
    }

    try {
      await userAPI.toggleWishlist(id);
      setInWishlist((value) => !value);
      refreshProfile();
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (!tour) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="text-lg text-slate-500">Tour not found</p>
        <Link to="/destinations" className="btn-primary">Browse Tours</Link>
      </div>
    );
  }

  const totalPrice = tour.price * booking.travelers;
  const images = tour.images?.length ? tour.images : [IMAGES.defaultTour];

  return (
    <div className="min-h-screen bg-light">
      <div className="border-b border-slate-200 bg-white pt-20">
        <div className="container py-4">
          <Link to="/destinations" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-primary">
            <ArrowLeft size={16} /> Back to Destinations
          </Link>
        </div>
      </div>

      <section className="container py-8 md:py-10">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="relative h-72 overflow-hidden rounded-lg bg-slate-200 sm:h-[28rem] lg:col-span-2">
            <img src={getImageUrl(images[activeImage], 1300)} alt={tour.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImage((index) => (index - 1 + images.length) % images.length)}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition-colors hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage((index) => (index + 1) % images.length)}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition-colors hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                      className={`h-2 rounded-full transition-all ${index === activeImage ? 'w-7 bg-white' : 'w-2 bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="hidden gap-4 lg:grid">
            {images.slice(1, 3).map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(index + 1)}
                className="group relative overflow-hidden rounded-lg bg-slate-200 text-left"
              >
                <img src={getImageUrl(image, 700)} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {index === 1 && images.length > 3 && (
                  <span className="absolute inset-0 flex items-center justify-center bg-dark/50 text-sm font-bold text-white">
                    +{images.length - 3} more photos
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div className="min-w-0 space-y-8">
            <section>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="badge mb-4 bg-accent/10 capitalize text-accent">{tour.category || 'Tour'}</span>
                  <h1 className="font-display text-3xl font-semibold leading-tight text-primary sm:text-4xl lg:text-5xl">
                    {tour.title}
                  </h1>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    {[
                      { icon: MapPin, text: `${tour.city}, ${tour.country}` },
                      { icon: Clock, text: `${tour.duration} days` },
                      { icon: Star, text: `${tour.rating || 'New'} (${tour.reviewCount || 0} reviews)`, accent: true },
                    ].map(({ icon: Icon, text, accent }) => (
                      <span key={text} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                        <Icon size={15} className={accent ? 'fill-accent text-accent' : 'text-secondary'} />
                        {text}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleWishlist}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    inWishlist
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-slate-200 bg-white text-slate-400 hover:border-red-200 hover:text-red-500'
                  }`}
                >
                  <Heart size={22} fill={inWishlist ? 'currentColor' : 'none'} />
                </button>
              </div>
              <p className="mt-6 text-base leading-relaxed text-slate-600">{tour.description}</p>
            </section>

            {tour.includedServices?.length > 0 && (
              <section className="card p-6 md:p-7">
                <h2 className="font-display text-2xl font-semibold text-primary">What's Included</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {tour.includedServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check size={13} />
                      </span>
                      {service}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {tour.excludedServices?.length > 0 && (
              <section className="card p-6 md:p-7">
                <h2 className="font-display text-2xl font-semibold text-primary">Not Included</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {tour.excludedServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                        <X size={13} />
                      </span>
                      {service}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {tour.hotelInfo && (
              <section className="rounded-lg border border-primary/10 bg-gradient-to-br from-white to-secondary/10 p-6 md:p-7">
                <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-primary">
                  <Hotel size={22} className="text-secondary" /> Accommodation
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{tour.hotelInfo}</p>
              </section>
            )}

            <section className="space-y-5">
              <h2 className="font-display text-2xl font-semibold text-primary">
                Guest Reviews <span className="font-sans text-base font-normal text-slate-400">({reviews.length})</span>
              </h2>

              <ReviewForm
                tourId={id}
                onReviewAdded={(review) => {
                  setReviews((prev) => [review, ...prev]);
                  setTour((current) => current ? { ...current, reviewCount: (current.reviewCount || 0) + 1 } : current);
                }}
              />

              {reviews.length === 0 ? (
                <div className="card p-8 text-center text-sm text-slate-500">
                  No reviews yet. Be the first to share your experience.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <article key={review._id} className="card p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                          {review.user?.name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary">{review.user?.name}</p>
                          <div className="mt-1 flex gap-0.5">
                            {Array.from({ length: review.rating || 0 }).map((_, index) => (
                              <Star key={index} size={13} className="fill-accent text-accent" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600">{review.comment}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="card sticky top-24 p-6"
            >
              <div className="border-b border-slate-100 pb-5">
                <span className="text-xs font-bold uppercase text-slate-400">Starting from</span>
                <p className="mt-1 font-display text-4xl font-semibold text-primary">
                  {formatPrice(tour.price)}
                  <span className="font-sans text-sm font-normal text-slate-500"> /person</span>
                </p>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Travel Date</label>
                  <select
                    value={booking.travelDate}
                    onChange={(e) => setBooking({ ...booking, travelDate: e.target.value })}
                    className="input-field"
                  >
                    {tour.availableDates?.map((date, index) => (
                      <option key={index} value={date.split('T')[0]}>{formatDate(date)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Travelers</label>
                  <select
                    value={booking.travelers}
                    onChange={(e) => setBooking({ ...booking, travelers: e.target.value })}
                    className="input-field"
                  >
                    {Array.from({ length: tour.maxTravelers || 10 }, (_, index) => index + 1).map((count) => (
                      <option key={count} value={count}>{count} {count === 1 ? 'Traveler' : 'Travelers'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Special Requests</label>
                  <textarea
                    value={booking.specialRequests}
                    onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Dietary needs, accessibility, celebrations..."
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">
                <div className="flex justify-between gap-4 text-sm text-slate-500">
                  <span>{formatPrice(tour.price)} x {booking.travelers} travelers</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between gap-4 pt-2 text-xl font-bold text-primary">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button type="button" onClick={handleBook} disabled={bookingLoading} className="btn-accent mt-6 w-full py-4 text-base">
                {bookingLoading ? 'Processing...' : 'Book This Tour'}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs leading-relaxed text-slate-500">
                <Shield size={14} className="shrink-0 text-secondary" />
                Free cancellation up to 48 hours before departure
              </div>
            </motion.div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default TourDetails;
