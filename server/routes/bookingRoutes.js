import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  getBookingStats,
  getBookingById,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/stats', protect, admin, getBookingStats);
router.get('/all', protect, admin, getAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);

export default router;
