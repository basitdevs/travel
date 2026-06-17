import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.get('/stats', protect, admin, getDashboardStats);

export default router;
