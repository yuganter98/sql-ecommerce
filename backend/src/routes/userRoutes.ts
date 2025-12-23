import { Router } from 'express';
import { getUsers, getUserById, updateUserProfile } from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getUsers);
router.put('/profile', authenticateJWT, updateUserProfile);
router.get('/:id', getUserById);

export default router;
