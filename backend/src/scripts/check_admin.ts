
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking for admin users...');
    try {
        const admins = await prisma.users.findMany({
            where: {
                role: 'admin'
            }
        });

        if (admins.length === 0) {
            console.log('No admin users found.');
            // Create default admin
            console.log('Creating default admin user...');
            // We need bcrypt, but for this quick script let's just checking if we can reuse similar logic or just import it.
            // Actually, better to just list first.
        } else {
            console.log('Found admin users:');
            admins.forEach(admin => {
                console.log(`- ID: ${admin.user_id}, Email: ${admin.email}, Role: ${admin.role}`);
            });
        }
    } catch (error) {
        console.error('Error querying database:', error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
