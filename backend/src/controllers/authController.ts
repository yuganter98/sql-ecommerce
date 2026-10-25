import { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/database';
import { env, authCookieOptions } from '../config/env';
import { sendPasswordResetEmail } from '../services/emailService';

const TOKEN_MAX_AGE = 3600000; // 1 hour, matches the JWT expiry
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

const signToken = (user: { user_id: string; email: string; role?: string | null }) =>
    jwt.sign(
        { id: user.user_id, email: user.email, role: user.role ?? 'user' },
        env.jwtSecret,
        { expiresIn: '1h' }
    );

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }
        if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
        }

        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Split name into first and last name (simple logic)
        const nameParts = String(name).trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        const user = await prisma.users.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                email,
                password_hash: passwordHash,
            },
        });

        const token = signToken(user);

        res.status(201)
            .cookie('jwt', token, { ...authCookieOptions, maxAge: TOKEN_MAX_AGE })
            .json({
                message: 'Registration successful',
                user: {
                    id: user.user_id,
                    name: `${user.first_name} ${user.last_name}`.trim(),
                    email: user.email,
                    role: user.role,
                    phone_number: user.phone_number,
                    address: user.address,
                    city: user.city,
                    country: user.country,
                },
            });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user);

        res
            .cookie('jwt', token, { ...authCookieOptions, maxAge: TOKEN_MAX_AGE })
            .json({
                message: 'Login successful',
                user: {
                    id: user.user_id,
                    name: `${user.first_name} ${user.last_name}`.trim(),
                    email: user.email,
                    role: user.role,
                    phone_number: user.phone_number,
                    address: user.address,
                    city: user.city,
                    country: user.country,
                },
            });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const googleLogin = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

export const googleCallback = (req: Request, res: Response) => {
    passport.authenticate('google', { session: false }, (err: any, user: any) => {
        if (err || !user) {
            return res.redirect(`${env.frontendUrl}/login?error=google_auth_failed`);
        }

        const token = signToken(user);

        res.cookie('jwt', token, { ...authCookieOptions, maxAge: TOKEN_MAX_AGE });

        // Hand control back to the SPA, which reads the session from the cookie.
        res.redirect(`${env.frontendUrl}/dashboard`);
    })(req, res);
};

export const forgotPassword = async (req: Request, res: Response) => {
    // Always respond with the same generic message so this endpoint cannot be
    // used to enumerate which emails (or admin accounts) exist.
    const genericResponse = { message: 'If an account with that email exists, a reset link has been sent.' };

    try {
        const { email } = req.body;
        if (!email || !EMAIL_REGEX.test(email)) {
            return res.status(200).json(genericResponse);
        }

        const user = await prisma.users.findUnique({ where: { email } });

        // Silently skip unknown users and admin accounts (admins reset out of band).
        if (user && user.role !== 'admin') {
            const resetToken = crypto.randomBytes(32).toString('hex');
            const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            await prisma.users.update({
                where: { email },
                data: {
                    reset_password_token: passwordResetToken,
                    reset_password_expires: passwordResetExpires,
                },
            });

            const resetUrl = `${env.frontendUrl}/reset-password?token=${resetToken}`;
            await sendPasswordResetEmail(email, resetUrl);
        }

        return res.status(200).json(genericResponse);
    } catch (err) {
        console.error('Forgot password error:', err);
        // Still return the generic message to avoid leaking internal state.
        return res.status(200).json(genericResponse);
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        if (!token || typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await prisma.users.findFirst({
            where: {
                reset_password_token: hashedToken,
                reset_password_expires: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await prisma.users.update({
            where: { user_id: user.user_id },
            data: {
                password_hash: passwordHash,
                reset_password_token: null,
                reset_password_expires: null,
            },
        });

        res.status(200).json({ message: 'Password reset successful!' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('jwt', authCookieOptions);
    res.status(200).json({ message: 'Logged out successfully' });
};
