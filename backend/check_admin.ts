
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking for admin users...');
    const admins = await prisma.users.findMany({
        where: {
            role: 'admin'
        }
    });

    if (admins.length === 0) {
        console.log('No admin users found.');
    } else {
        console.log('Found admin users:');
        admins.forEach(admin => {
            console.log(`- ID: ${admin.user_id}, Email: ${admin.email}, Role: ${admin.role}`);
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
