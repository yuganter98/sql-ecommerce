import { Router } from 'express';
import { googleLogin, googleCallback, register, login, forgotPassword, resetPassword, logout } from '../controllers/authController';
import { rateLimit } from '../middleware/rateLimit';

const router = Router();

// Throttle credential and password-reset endpoints to blunt brute-force and abuse.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

export default router;
