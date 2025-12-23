import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'test@example.com'; // Replace with the user's email you want to make admin

    try {
        const user = await prisma.users.update({
            where: { email: email },
            data: { role: 'admin' },
        });
        console.log(`User ${user.email} is now an admin.`);
    } catch (error) {
        console.error('Error updating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
