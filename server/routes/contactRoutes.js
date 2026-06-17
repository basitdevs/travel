import { Router } from 'express';
import { createContact, getAllContacts, markContactRead, deleteContact } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.post('/', createContact);
router.get('/', protect, admin, getAllContacts);
router.put('/:id/read', protect, admin, markContactRead);
router.delete('/:id', protect, admin, deleteContact);

export default router;
