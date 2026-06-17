import Booking from '../models/Booking.js';
import Contact from '../models/Contact.js';
import Review from '../models/Review.js';
import Tour from '../models/Tour.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalBookings, activeTours, revenue, recentBookings, unreadMessages, totalReviews] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Booking.countDocuments(),
    Tour.countDocuments({ isActive: true }),
    Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Booking.find().populate('tour', 'title').populate('user', 'name').sort({ createdAt: -1 }).limit(5),
    Contact.countDocuments({ isRead: false }),
    Review.countDocuments(),
  ]);

  res.json({
    totalUsers,
    totalBookings,
    activeTours,
    revenue: revenue[0]?.total || 0,
    recentBookings,
    unreadMessages,
    totalReviews,
  });
});
