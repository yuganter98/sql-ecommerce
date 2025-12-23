
const { PrismaClient } = require('@prisma/client');

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
        } else {
            console.log('Found admin users:');
            admins.forEach(admin => {
                console.log(`- ID: ${admin.user_id}, Name: ${admin.first_name} ${admin.last_name}, Email: ${admin.email}`);
            });
        }
    } catch (error) {
        console.error('Error querying database:', error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
