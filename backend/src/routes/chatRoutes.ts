import { Router } from 'express';
import { chatWithAI, generateDescription, personalShopper } from '../controllers/chatController';

const router = Router();

router.post('/', chatWithAI);
router.post('/generate-description', generateDescription);
router.post('/personal-shopper', personalShopper);

export default router;
