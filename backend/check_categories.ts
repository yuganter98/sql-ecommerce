
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.categories.findMany();
    console.log('All Categories:', categories);

    const nameCounts: { [key: string]: number } = {};
    categories.forEach(c => {
        nameCounts[c.name] = (nameCounts[c.name] || 0) + 1;
    });

    console.log('Duplicate Counts:', nameCounts);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
