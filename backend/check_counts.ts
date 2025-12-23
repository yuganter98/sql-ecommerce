
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking category counts...');
    const categories = await prisma.categories.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    categories.forEach(cat => {
        console.log(`Category: ${cat.name}, Count: ${cat._count.products}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
