import { Router, Request, Response } from 'express';

const router = Router();

import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import categoryRoutes from './categoryRoutes';
import adminRoutes from './adminRoutes';
import chatRoutes from './chatRoutes';
import searchRoutes from './searchRoutes';
import recommendationRoutes from './recommendationRoutes';


router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/admin', adminRoutes);
router.use('/chat', chatRoutes);
router.use('/search', searchRoutes);
router.use('/recommendations', recommendationRoutes);

router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the E-commerce API' });
});

export default router;
