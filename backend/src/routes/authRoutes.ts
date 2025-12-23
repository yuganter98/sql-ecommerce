import { Router } from 'express';
import { googleLogin, googleCallback, register, login, forgotPassword, resetPassword, logout } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
