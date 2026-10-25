
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Resetting admin password...');
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
        console.error('Set ADMIN_PASSWORD (and optionally ADMIN_EMAIL) in the environment before running this script.');
        process.exit(1);
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await prisma.users.update({
            where: { email: email },
            data: {
                password_hash: passwordHash
            }
        });

        console.log(`Password for ${email} has been reset (value taken from ADMIN_PASSWORD).`);
    } catch (error) {
        console.error('Error updating password:', error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
