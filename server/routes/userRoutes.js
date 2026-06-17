import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  toggleWishlist,
  getAllUsers,
  blockUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/wishlist/:tourId', protect, toggleWishlist);
router.get('/', protect, admin, getAllUsers);
router.put('/:id/block', protect, admin, blockUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;
