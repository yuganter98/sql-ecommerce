
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Resetting admin password...');
    const email = 'admin@example.com';
    const password = 'admin123';

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await prisma.users.update({
            where: { email: email },
            data: {
                password_hash: passwordHash
            }
        });

        console.log(`Password for ${email} has been reset to: ${password}`);
    } catch (error) {
        console.error('Error updating password:', error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
