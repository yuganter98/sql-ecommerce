import { Router } from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController';
import { authenticateJWT, isAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticateJWT, isAdmin, createCategory);
router.delete('/:id', authenticateJWT, isAdmin, deleteCategory);

export default router;
