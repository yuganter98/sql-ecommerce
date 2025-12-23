import { Router } from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-order', authenticateJWT, createRazorpayOrder);
router.post('/verify-payment', authenticateJWT, verifyPayment);

export default router;
