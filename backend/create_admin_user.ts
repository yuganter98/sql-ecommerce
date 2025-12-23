import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const password = 'admin123';

    try {
        // Check if user exists
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            console.log('User already exists. Updating role...');
            await prisma.users.update({
                where: { email },
                data: { role: 'admin' }
            });
            console.log('User role updated to admin.');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.users.create({
            data: {
                first_name: 'Admin',
                last_name: 'User',
                email,
                password_hash: passwordHash,
                role: 'admin'
            },
        });
        console.log(`Created admin user: ${user.email}`);
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
