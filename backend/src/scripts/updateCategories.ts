import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding categories...');

    // 1. Update existing categories
    const clothing = await prisma.categories.findFirst({ where: { name: 'Clothing' } });
    if (clothing) {
        await prisma.categories.update({
            where: { category_id: clothing.category_id },
            data: { has_sizes: true },
        });
        console.log('Updated Clothing to have sizes.');
    }

    // 2. Create new categories
    const newCategories = [
        { name: 'Shoes', has_sizes: true, description: 'Footwear for all occasions' },
        { name: 'Accessories', has_sizes: false, description: 'Bags, jewelry, and more' },
    ];

    for (const cat of newCategories) {
        const existing = await prisma.categories.findFirst({ where: { name: cat.name } });
        if (!existing) {
            await prisma.categories.create({
                data: {
                    name: cat.name,
                    description: cat.description,
                    has_sizes: cat.has_sizes,
                },
            });
            console.log(`Created category: ${cat.name}`);
        } else {
            // Update if exists (e.g. to set has_sizes)
            await prisma.categories.update({
                where: { category_id: existing.category_id },
                data: { has_sizes: cat.has_sizes },
            });
            console.log(`Updated category: ${cat.name}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
