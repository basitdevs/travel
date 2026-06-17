import { Router } from 'express';
import { createReview, getTourReviews, getAllReviews, deleteReview } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createReview);
router.get('/all', protect, admin, getAllReviews);
router.get('/:tourId', getTourReviews);
router.delete('/:id', protect, admin, deleteReview);

export default router;
