import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                users: true,
                order_items: true
            }
        });
        console.log(`Found ${orders.length} orders.`);
        if (orders.length > 0) {
            console.log('First order:', JSON.stringify(orders[0], null, 2));
        }
    } catch (error) {
        console.error('Error checking orders:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
