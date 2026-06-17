import { Router } from 'express';
import {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getFeaturedTours,
  getTourStats,
} from '../controllers/tourController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.get('/', getTours);
router.get('/featured', getFeaturedTours);
router.get('/stats', protect, admin, getTourStats);
router.get('/:id', getTourById);
router.post('/', protect, admin, createTour);
router.put('/:id', protect, admin, updateTour);
router.delete('/:id', protect, admin, deleteTour);

export default router;
