
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
        console.error('Set ADMIN_PASSWORD (and optionally ADMIN_EMAIL) in the environment before running this script.');
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.upsert({
        where: { email },
        update: {
            role: 'admin',
            password_hash: hashedPassword,
        },
        create: {
            first_name: 'Admin',
            last_name: 'User',
            email,
            password_hash: hashedPassword,
            role: 'admin',
            address: '123 Admin St, Cloud City',
            country: 'Internet',
            city: 'Server',
            phone_number: '000-000-0000'
        },
    });

    console.log(`
    ✅ Admin User Created/Updated Successfully!
    -------------------------------------------
    Email:    ${email}
    Password: (value taken from ADMIN_PASSWORD)
    Role:     ${user.role}
    -------------------------------------------
    You can now log in to the Admin Dashboard.
    `);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
