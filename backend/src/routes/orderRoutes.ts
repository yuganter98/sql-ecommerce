import { Router } from 'express';
import { getOrders, getOrderById, createOrder } from '../controllers/orderController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateJWT, getOrders);
router.get('/:id', authenticateJWT, getOrderById);
router.post('/', authenticateJWT, createOrder);

export default router;
