import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import * as orderService from '../services/orderService';
import { env } from '../config/env';

interface AuthRequest extends Request {
    user?: { id?: string; role?: string };
}

/**
 * Lazily build the Razorpay client. Returns null when keys are not configured,
 * so the API responds 503 instead of silently signing with a placeholder secret.
 */
const getRazorpay = (): Razorpay | null => {
    if (!env.razorpay.keyId || !env.razorpay.keySecret) {
        return null;
    }
    return new Razorpay({
        key_id: env.razorpay.keyId,
        key_secret: env.razorpay.keySecret,
    });
};

export const createRazorpayOrder = async (req: AuthRequest, res: Response) => {
    const razorpay = getRazorpay();
    if (!razorpay) {
        return res.status(503).json({ error: 'Payments are not configured' });
    }

    const { items, currency = 'INR' } = req.body;

    try {
        // Price the cart on the server from DB prices — never trust a
        // client-supplied amount. This closes the "pay ₹1 for a ₹10,000 order" hole.
        const total = await orderService.calculateOrderTotal(items);
        if (total <= 0) {
            return res.status(400).json({ error: 'Invalid order total' });
        }

        const options = {
            amount: Math.round(total * 100), // smallest currency unit (paise)
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        const message = typeof error?.message === 'string' ? error.message : '';
        const isClientError = /item|quantity|available|total/i.test(message);
        res.status(isClientError ? 400 : 500).json({ error: isClientError ? message : 'Failed to create payment order' });
    }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
    if (!env.razorpay.keySecret) {
        return res.status(503).json({ error: 'Payments are not configured' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_details } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
        .createHmac('sha256', env.razorpay.keySecret)
        .update(body)
        .digest('hex');

    // Constant-time comparison to avoid signature timing attacks.
    const signatureValid =
        expectedSignature.length === String(razorpay_signature).length &&
        crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(String(razorpay_signature)));

    if (!signatureValid) {
        return res.status(400).json({ error: 'Invalid signature' });
    }

    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { items, shipping_address } = order_details || {};

        // The order is created and priced server-side again, so the amount paid
        // cannot diverge from what the DB charges.
        const order = await orderService.createOrder(userId, items, shipping_address, 'CARD', {
            paymentStatus: 'COMPLETED',
        });

        res.json({ status: 'success', order });
    } catch (error: any) {
        console.error('Error creating order after payment:', error);
        res.status(500).json({ error: 'Payment verified but order creation failed' });
    }
};
