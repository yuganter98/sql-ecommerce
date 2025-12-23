import prisma from '../config/database';

export const getAllUsers = async () => {
    return await prisma.users.findMany();
};

export const getUserById = async (id: string) => {
    return await prisma.users.findUnique({
        where: { user_id: id },
        include: {
            orders: true,
        },
    });
};

export const getUserByEmail = async (email: string) => {
    return await prisma.users.findUnique({
        where: { email },
    });
};

export const createUser = async (data: any) => {
    return await prisma.users.create({
        data,
    });
};

export const updateUser = async (id: string, data: any) => {
    return await prisma.users.update({
        where: { user_id: id },
        data,
    });
};
