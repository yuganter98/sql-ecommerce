import { Router } from 'express';
import { getRecommendedProducts } from '../controllers/recommendationController';

const router = Router();

router.post('/', getRecommendedProducts);

export default router;
