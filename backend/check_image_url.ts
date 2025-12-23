
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const product = await prisma.products.findFirst({
        where: { name: 'Canvas Tote Bag' }
    });

    if (product) {
        console.log('Product Found:');
        console.log('ID:', product.product_id);
        console.log('Name:', product.name);
        console.log('Image URL:', product.image_url);
    } else {
        console.log('Product "Canvas Tote Bag" not found.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
