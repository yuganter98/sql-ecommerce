import prisma from '../config/database';

// User fields that are safe to expose when an order is returned with its owner.
// Never includes password_hash or reset-token columns.
const safeUserSelect = {
    user_id: true,
    first_name: true,
    last_name: true,
    email: true,
} as const;

export interface OrderItemInput {
    product_id: string;
    quantity: number;
}

export const getAllOrders = async () => {
    return await prisma.orders.findMany({
        include: {
            users: { select: safeUserSelect },
            order_items: { include: { products: true } },
        },
    });
};

export const getOrdersByUserId = async (userId: string) => {
    return await prisma.orders.findMany({
        where: { user_id: userId },
        include: {
            order_items: { include: { products: true } },
        },
        orderBy: { order_date: 'desc' },
    });
};

export const getOrderById = async (id: string) => {
    return await prisma.orders.findUnique({
        where: { order_id: id },
        include: {
            users: { select: safeUserSelect },
            order_items: { include: { products: true } },
        },
    });
};

/**
 * Validates the requested items and returns the server-computed total, priced
 * strictly from the database. Used by the payment flow so the amount charged
 * can never be set by the client.
 */
export const calculateOrderTotal = async (items: OrderItemInput[]): Promise<number> => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Order must contain at least one item');
    }

    let total = 0;
    for (const item of items) {
        if (!item || typeof item.product_id !== 'string') {
            throw new Error('Invalid item in order');
        }
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            throw new Error('Item quantity must be a positive integer');
        }

        const product = await prisma.products.findUnique({ where: { product_id: item.product_id } });
        if (!product || product.is_active === false) {
            throw new Error(`Product ${item.product_id} not available`);
        }
        total += Number(product.price) * item.quantity;
    }
    return total;
};

export const createOrder = async (
    userId: string,
    items: OrderItemInput[],
    shippingAddress: string,
    paymentMethod: string,
    options: { paymentStatus?: string } = {}
) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Order must contain at least one item');
    }

    return await prisma.$transaction(async (tx) => {
        // 1. Create the order shell
        const order = await tx.orders.create({
            data: {
                user_id: userId,
                shipping_address: shippingAddress,
                payment_method: paymentMethod,
                total_amount: 0, // recalculated below from DB prices
                status: 'PENDING',
            },
        });

        // 2. Create order items and deduct stock atomically
        let totalAmount = 0;
        for (const item of items) {
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new Error('Item quantity must be a positive integer');
            }

            const product = await tx.products.findUnique({ where: { product_id: item.product_id } });
            if (!product || product.is_active === false) {
                throw new Error(`Product ${item.product_id} not available`);
            }

            // Atomic, conditional stock decrement: only succeeds if enough stock
            // remains, which prevents overselling under concurrent orders.
            const decremented = await tx.products.updateMany({
                where: { product_id: item.product_id, stock_quantity: { gte: item.quantity } },
                data: { stock_quantity: { decrement: item.quantity } },
            });
            if (decremented.count === 0) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }

            const subtotal = Number(product.price) * item.quantity;
            totalAmount += subtotal;

            await tx.order_items.create({
                data: {
                    order_id: order.order_id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: product.price,
                    subtotal: subtotal,
                },
            });
        }

        // 3. Update order total
        const updatedOrder = await tx.orders.update({
            where: { order_id: order.order_id },
            data: { total_amount: totalAmount },
            include: { order_items: true },
        });

        // 4. Create payment record
        await tx.payments.create({
            data: {
                order_id: order.order_id,
                amount: totalAmount,
                payment_method: paymentMethod,
                status: options.paymentStatus ?? (paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED'),
            },
        });

        return updatedOrder;
    });
};
