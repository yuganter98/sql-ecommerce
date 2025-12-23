import { Request, Response } from 'express';
import prisma from '../config/database';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.categories.findMany({
            include: {
                _count: {
                    select: { products: true }
                },
                products: {
                    take: 1,
                    orderBy: { created_at: 'desc' },
                    select: { image_url: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Transform response to include a cleaner image field
        const formattedCategories = categories.map(cat => ({
            ...cat,
            image: cat.products[0]?.image_url || null
        }));

        res.json(formattedCategories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const category = await prisma.categories.create({
            data: {
                name,
                description
            }
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    console.log('Backend: deleteCategory called for id:', req.params.id); // DEBUG
    try {
        const { id } = req.params;

        // Check if category has products
        const productsCount = await prisma.products.count({
            where: { category_id: id }
        });

        if (productsCount > 0) {
            return res.status(400).json({ error: 'Cannot delete category with associated products' });
        }

        await prisma.categories.delete({
            where: { category_id: id }
        });

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
