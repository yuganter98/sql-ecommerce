
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const password = 'admin123';
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
    Password: ${password}
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
