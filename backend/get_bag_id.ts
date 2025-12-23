
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const product = await prisma.products.findFirst({
        where: { name: 'Canvas Tote Bag' }
    });
    if (product) console.log(product.product_id);
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
