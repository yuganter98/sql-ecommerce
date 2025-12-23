import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding product images...');

    // Find some electronics products
    const electronics = await prisma.categories.findFirst({
        where: { name: 'Electronics' },
        include: { products: true }
    });

    if (!electronics || electronics.products.length === 0) {
        console.log('No electronics products found.');
        return;
    }

    const images = [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop'
    ];

    for (const product of electronics.products) {
        console.log(`Adding images to ${product.name}...`);

        // Add 3 random images to each product
        for (let i = 0; i < 3; i++) {
            await prisma.product_images.create({
                data: {
                    product_id: product.product_id,
                    image_url: images[Math.floor(Math.random() * images.length)],
                    display_order: i
                }
            });
        }
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
