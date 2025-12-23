import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendWelcomeEmail } from '../services/emailService';

const prisma = new PrismaClient();

export const subscribe = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    try {
        // Check if already subscribed
        const existing = await prisma.newsletter_subscribers.findUnique({
            where: { email },
        });

        if (existing) {
            res.status(400).json({ error: 'Email already subscribed' });
            return;
        }

        // Add to DB
        await prisma.newsletter_subscribers.create({
            data: { email },
        });

        // Send Welcome Email (async, don't wait)
        sendWelcomeEmail(email);

        res.status(201).json({ message: 'Subscribed successfully!' });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
