import { Router } from 'express';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  getPopularDestinations,
} from '../controllers/destinationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.get('/', getDestinations);
router.get('/popular', getPopularDestinations);
router.get('/:id', getDestinationById);
router.post('/', protect, admin, createDestination);
router.put('/:id', protect, admin, updateDestination);
router.delete('/:id', protect, admin, deleteDestination);

export default router;
