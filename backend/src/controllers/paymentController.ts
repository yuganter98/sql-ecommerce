import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import * as orderService from '../services/orderService';

// Initialize Razorpay with test keys (or from env)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

export const createRazorpayOrder = async (req: Request, res: Response) => {
    const { amount, currency = 'INR' } = req.body;

    try {
        const options = {
            amount: amount * 100, // Amount in smallest currency unit (paise)
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create payment order' });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_details } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        try {
            // Payment verified, now create the actual order in DB
            // @ts-ignore
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { items, shipping_address } = order_details;

            // Create order with 'COMPLETED' payment status
            const order = await orderService.createOrder(userId, items, shipping_address, 'CARD');

            // You might want to update the payment record with the razorpay_payment_id here
            // For now, orderService.createOrder handles basic payment record creation

            res.json({ status: 'success', order });
        } catch (error) {
            console.error('Error creating order after payment:', error);
            res.status(500).json({ error: 'Payment verified but order creation failed' });
        }
    } else {
        res.status(400).json({ error: 'Invalid signature' });
    }
};
