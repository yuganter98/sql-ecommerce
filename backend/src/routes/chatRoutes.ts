import { Router } from 'express';
import { chatWithAI, generateDescription, personalShopper } from '../controllers/chatController';
import { rateLimit } from '../middleware/rateLimit';

const router = Router();

// The AI endpoints spend external (OpenAI) credit, so cap requests per client.
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 15, message: 'Too many AI requests, please slow down.' });

router.post('/', aiLimiter, chatWithAI);
router.post('/generate-description', aiLimiter, generateDescription);
router.post('/personal-shopper', aiLimiter, personalShopper);

export default router;
