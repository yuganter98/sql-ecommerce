import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAddresses = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const addresses = await prisma.user_addresses.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });
        res.json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const addAddress = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { address_line, city, country, is_default } = req.body;

        await prisma.$transaction(async (tx) => {
            if (is_default) {
                // Unset other defaults
                await tx.user_addresses.updateMany({
                    where: { user_id: userId, is_default: true },
                    data: { is_default: false }
                });
            }

            const newAddress = await tx.user_addresses.create({
                data: {
                    user_id: userId,
                    address_line,
                    city,
                    country,
                    is_default: is_default || false
                }
            });
            res.status(201).json(newAddress);
        });
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        const { id } = req.params;

        await prisma.user_addresses.deleteMany({
            where: { address_id: id, user_id: userId }
        });

        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
