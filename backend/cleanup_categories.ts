
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up duplicate categories...');

    // 1. Fetch all with counts
    const categories = await prisma.categories.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        },
        orderBy: {
            created_at: 'asc' // Assuming there is created_at, or just order independent
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

            // Sort by product count descending
            cats.sort((a, b) => b._count.products - a._count.products);

            const toKeep = cats[0];
            const toDelete = cats.slice(1);

            console.log(`Keeping ID: ${toKeep.category_id} (Count: ${toKeep._count.products})`);

            for (const dead of toDelete) {
                console.log(`Deleting ID: ${dead.category_id} (Count: ${dead._count.products})`);
                // Only delete if count is 0 to be safe, otherwise we'd need to migrate products
                if (dead._count.products === 0) {
                    try {
                        await prisma.categories.delete({
                            where: { category_id: dead.category_id }
                        });
                        console.log('Deleted.');
                    } catch (e) {
                        console.error('Failed to delete:', e);
                    }
                } else {
                    console.warn('Skipping delete because it has products (need manual merge).');
                }
            }
        }
    }

    console.log('Cleanup complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
