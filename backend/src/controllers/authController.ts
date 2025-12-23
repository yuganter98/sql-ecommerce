import { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user exists
        const existingUser = await prisma.users.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Split name into first and last name (simple logic)
        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        // Create user
        const user = await prisma.users.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                email,
                password_hash: passwordHash,
            },
        });

        // Generate JWT
        const token = jwt.sign(
            { id: user.user_id, email: user.email, role: (user as any).role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.status(201)
            .cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax', // Use 'lax' for local dev, 'strict' or 'none' (with secure) for prod
                maxAge: 3600000 // 1 hour
            })
            .json({
                message: 'Registration successful',
                user: {
                    id: user.user_id,
                    name: `${user.first_name} ${user.last_name}`.trim(),
                    email: user.email,
                    role: (user as any).role,
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

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.user_id, email: user.email, role: (user as any).role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res
            .cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 3600000
            })
            .json({
                message: 'Login successful',
                user: {
                    id: user.user_id,
                    name: `${user.first_name} ${user.last_name}`.trim(),
                    email: user.email,
                    role: (user as any).role,
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
            return res.status(400).json({ error: 'Authentication failed' });
        }

        const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h',
        });

        // Redirect to frontend with token (in a real app)
        // For now, just return the token
        // Redirect to frontend
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000
        });

        // In a real app involving callbacks, usually you redirect to a frontend page
        // which then fetches the user. For this simple setup, we might need a different flow.
        // But assuming this is an API response used by a popup or similar:
        res.json({ message: 'Google login successful', user });
    })(req, res);
};

import crypto from 'crypto';
import { sendPasswordResetEmail } from '../services/emailService';

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Admin passwords cannot be reset via this form. Please contact support.' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Token expires in 10 minutes
        const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.users.update({
            where: { email },
            data: {
                // @ts-ignore
                reset_password_token: passwordResetToken,
                // @ts-ignore
                reset_password_expires: passwordResetExpires
            }
        });

        // Create reset URL
        // Assuming frontend runs on different port or same domain
        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

        await sendPasswordResetEmail(email, resetUrl);

        res.status(200).json({ message: 'Token sent to email!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error sending email' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        // Hash the token from the URL to compare with DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await prisma.users.findFirst({
            where: {
                // @ts-ignore
                reset_password_token: hashedToken,
                // @ts-ignore
                reset_password_expires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }

        // Update password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await prisma.users.update({
            where: { user_id: user.user_id },
            data: {
                password_hash: passwordHash,
                // @ts-ignore
                reset_password_token: null,
                // @ts-ignore
                reset_password_expires: null
            }
        });

        res.status(200).json({ message: 'Password reset successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
