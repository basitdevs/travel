import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';
import { sendEmail, bookingConfirmationEmail } from '../utils/sendEmail.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const populateBooking = (id, userFields = 'name email') =>
  Booking.findById(id).populate('tour').populate('user', userFields);

const travelerCount = (value) => {
  const count = Number(value);
  return Number.isNaN(count) ? 0 : count;
};

const ownsBooking = (booking, user) => {
  const ownerId = booking.user?._id || booking.user;
  if (!ownerId) return false;
  return ownerId.toString() === user._id.toString();
};

const canUseBooking = (booking, user) => user.role === 'admin' || ownsBooking(booking, user);

export const createBooking = asyncHandler(async (req, res) => {
  const { tourId, travelDate, travelers, specialRequests } = req.body;

  if (!tourId || !travelDate || !travelers) {
    return res.status(400).json({ message: 'Tour, travel date, and travelers are required' });
  }

  const count = travelerCount(travelers);
  if (count < 1) {
    return res.status(400).json({ message: 'Travelers must be at least 1' });
  }

  const tour = await Tour.findById(tourId);
  if (!tour || !tour.isActive) {
    return res.status(404).json({ message: 'Tour not found or unavailable' });
  }

  if (count > tour.maxTravelers) {
    return res.status(400).json({ message: `Maximum ${tour.maxTravelers} travelers allowed for this tour` });
  }

  const booking = await Booking.create({
    user: req.user._id,
    tour: tourId,
    travelDate,
    travelers: count,
    totalPrice: tour.price * count,
    specialRequests: specialRequests || '',
  });

  const populated = await populateBooking(booking._id);
  await sendEmail(bookingConfirmationEmail(populated, tour, populated.user));

  res.status(201).json(populated);
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('tour')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('tour')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  if (!canUseBooking(booking, req.user)) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  if (req.body.status) booking.status = req.body.status;
  if (req.body.travelDate) booking.travelDate = req.body.travelDate;
  if (req.body.travelers !== undefined) {
    const count = travelerCount(req.body.travelers);
    const tour = await Tour.findById(booking.tour);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    if (count < 1) return res.status(400).json({ message: 'Travelers must be at least 1' });
    if (count > tour.maxTravelers) {
      return res.status(400).json({ message: `Maximum ${tour.maxTravelers} travelers allowed for this tour` });
    }

    booking.travelers = count;
    booking.totalPrice = tour.price * count;
  }

  const updated = await booking.save();
  res.json(await populateBooking(updated._id));
});

export const getBookingStats = asyncHandler(async (req, res) => {
  const [total, pending, confirmed, revenue] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: 'confirmed' }),
    Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
  ]);

  res.json({
    total,
    pending,
    confirmed,
    revenue: revenue[0]?.total || 0,
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await populateBooking(req.params.id, 'name email phone');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  if (!canUseBooking(booking, req.user)) {
    return res.status(403).json({ message: 'Not authorized to view this booking' });
  }

  res.json(booking);
});
