
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- ACTUAL DB COUNTS ---');
    const categories = await prisma.categories.findMany({
        include: {
            products: {
                select: { product_id: true }
            }
        }
    });

    for (const cat of categories) {
        console.log(`Category: ${cat.name.padEnd(15)} | Count: ${cat.products.length}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
