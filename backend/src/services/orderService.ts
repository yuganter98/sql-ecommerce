import prisma from '../config/database';

export const getAllOrders = async () => {
    return await prisma.orders.findMany({
        include: {
            users: {
                select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                },
            },
            order_items: {
                include: {
                    products: true,
                },
            },
        },
    });
};

export const getOrdersByUserId = async (userId: string) => {
    return await prisma.orders.findMany({
        where: { user_id: userId },
        include: {
            order_items: {
                include: {
                    products: true,
                },
            },
        },
        orderBy: {
            order_date: 'desc',
        },
    });
};

export const getOrderById = async (id: string) => {
    return await prisma.orders.findUnique({
        where: { order_id: id },
        include: {
            users: true,
            order_items: {
                include: {
                    products: true,
                },
            },
        },
    });
};

export const createOrder = async (userId: string, items: any[], shippingAddress: string, paymentMethod: string) => {
    return await prisma.$transaction(async (prisma) => {
        // 1. Create the order
        const order = await prisma.orders.create({
            data: {
                user_id: userId,
                shipping_address: shippingAddress,
                payment_method: paymentMethod,
                total_amount: 0, // Placeholder, should be calculated
                status: 'PENDING',
            },
        });

        // 2. Create order items and update stock
        let totalAmount = 0;
        for (const item of items) {
            const product = await prisma.products.findUnique({ where: { product_id: item.product_id } });
            if (!product) throw new Error(`Product ${item.product_id} not found`);

            if (product.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }

            // Reduce stock
            await prisma.products.update({
                where: { product_id: item.product_id },
                data: { stock_quantity: product.stock_quantity - item.quantity }
            });

            const subtotal = Number(product.price) * item.quantity;
            totalAmount += subtotal;

            await prisma.order_items.create({
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
        const updatedOrder = await prisma.orders.update({
            where: { order_id: order.order_id },
            data: { total_amount: totalAmount },
            include: { order_items: true },
        });

        // 4. Create payment record
        await prisma.payments.create({
            data: {
                order_id: order.order_id,
                amount: totalAmount,
                payment_method: paymentMethod,
                status: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED', // Simplified logic
            },
        });

        return updatedOrder;
    });
};
