
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Merging duplicate categories...');

    // 1. Fetch all with counts
    const categories = await prisma.categories.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    const groups = new Map<string, typeof categories>();

    for (const cat of categories) {
        if (!groups.has(cat.name)) {
            groups.set(cat.name, []);
        }
        groups.get(cat.name)?.push(cat);
    }

    for (const [name, cats] of groups) {
        if (cats.length > 1) {
            console.log(`Found ${cats.length} duplicates for ${name}`);

            // Sort by product count descending. 
            // If counts are equal, use older one (or just first one)
            cats.sort((a, b) => b._count.products - a._count.products);

            const master = cats[0];
            const others = cats.slice(1);

            console.log(`Master: ${master.category_id} (id), Products: ${master._count.products}`);

            for (const other of others) {
                console.log(`Merging ${other.category_id} (Products: ${other._count.products}) -> Master`);

                // 1. Move products to Master
                const updateRes = await prisma.products.updateMany({
                    where: { category_id: other.category_id },
                    data: { category_id: master.category_id }
                });
                console.log(`Moved ${updateRes.count} products.`);

                // 2. Delete the specific duplicate category
                // CAREFUL: If there are other foreign keys (like unrelated tables), this might fail.
                // But for now products are the main one.
                try {
                    await prisma.categories.delete({
                        where: { category_id: other.category_id }
                    });
                    console.log('Deleted duplicate category.');
                } catch (e) {
                    console.error('Failed to delete duplicate category:', e);
                }
            }
        }
    }

    console.log('Merge complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
