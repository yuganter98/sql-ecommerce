import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import prisma from '../config/database';

interface AuthRequest extends Request {
    user?: { id?: string; role?: string };
}

export const getOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const orders = await orderService.getOrdersByUserId(userId);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const order = await orderService.getOrderById(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Only the order's owner (or an admin) may view it.
        if (order.user_id !== userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
    const { items, shipping_address, payment_method } = req.body;

    const user_id = req.user?.id;
    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
    }
    if (!shipping_address || typeof shipping_address !== 'string') {
        return res.status(400).json({ error: 'A shipping address is required' });
    }

    try {
        const result = await orderService.createOrder(user_id, items, shipping_address, payment_method || 'COD');

        // (Optional) order confirmation email could be sent here.
        const user = await prisma.users.findUnique({ where: { user_id } });
        void user; // email notification intentionally disabled for now

        res.status(201).json(result);
    } catch (error: any) {
        console.error('Error creating order:', error);
        // Surface validation/stock errors to the client; keep other details generic.
        const message = typeof error?.message === 'string' ? error.message : 'Internal Server Error';
        const isClientError = /stock|quantity|item|address|not available/i.test(message);
        res.status(isClientError ? 400 : 500).json({ error: isClientError ? message : 'Internal Server Error' });
    }
};
