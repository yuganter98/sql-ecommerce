import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import fs from 'fs';
import path from 'path';
// import { sendOrderConfirmation } from '../services/emailService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOrders = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
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

export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await orderService.getOrderById(id);

        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    const { items, shipping_address, payment_method } = req.body;

    try {
        const logPath = 'C:/Users/yugan/.gemini/antigravity/scratch/sql_ecommerce_project/backend/debug_order.log';
        const logData = `[${new Date().toISOString()}] createOrder body: ${JSON.stringify(req.body, null, 2)}\n`;
        fs.appendFileSync(logPath, logData);
    } catch (e) {
        console.error('Failed to write log', e);
    }

    // @ts-ignore
    const user_id = req.user?.id;

    if (!user_id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const result = await orderService.createOrder(user_id, items, shipping_address, payment_method);

        // Fetch user email for notification
        const user = await prisma.users.findUnique({ where: { user_id } });
        if (user && user.email) {
            // Construct basic order details for email
            // const orderDetails = {
            //     order_id: result.order_id,
            //     total_amount: result.total_amount,
            //     status: result.status,
            //     items: items
            // };
            // sendOrderConfirmation(user.email, orderDetails);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating order:', error);
        try {
            const logPath = 'C:/Users/yugan/.gemini/antigravity/scratch/sql_ecommerce_project/backend/debug_order.log';
            // @ts-ignore
            const errorLog = `[${new Date().toISOString()}] Error creating order: ${error.message}\nStack: ${error.stack}\n`;
            fs.appendFileSync(logPath, errorLog);
        } catch (e) {
            console.error('Failed to write error log', e);
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
