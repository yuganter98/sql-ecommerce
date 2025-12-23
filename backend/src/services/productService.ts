import prisma from '../config/database';

export const getAllProducts = async () => {
    return await prisma.products.findMany({
        include: {
            categories: true,
            product_images: true,
        },
        orderBy: {
            created_at: 'desc',
        },
    });
};

export const getProductById = async (id: string) => {
    return await prisma.products.findUnique({
        where: { product_id: id },
        include: {
            categories: true,
            reviews: true,
            product_images: {
                orderBy: {
                    display_order: 'asc'
                }
            }
        },
    });
};
