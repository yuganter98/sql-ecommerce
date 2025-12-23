import { Router } from 'express';
import { authenticateJWT, isAdmin } from '../middleware/authMiddleware';
import prisma from '../config/database';

const router = Router();

// Protect all admin routes
router.use(authenticateJWT, isAdmin);

// --- Dashboard Stats ---
router.get('/stats', async (req, res) => {
    try {
        const totalOrders = await prisma.orders.count();
        const totalProducts = await prisma.products.count();
        const totalUsers = await prisma.users.count();

        const revenueResult = await prisma.orders.aggregate({
            _sum: { total_amount: true },
            where: { status: { not: 'CANCELLED' } }
        });
        const totalRevenue = revenueResult._sum.total_amount || 0;

        const recentOrders = await prisma.orders.findMany({
            take: 5,
            orderBy: { order_date: 'desc' },
            include: {
                users: { select: { first_name: true, last_name: true, email: true } }
            }
        });

        res.json({
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue,
            recentOrders
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
});

// --- Products ---

// Add Product
router.post('/products', async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category_id, image_url, images } = req.body;
        const product = await prisma.products.create({
            data: {
                name,
                description,
                price,
                stock_quantity: Number(stock_quantity),
                category_id: category_id || null,
                image_url,
                sku: `SKU-${Date.now()}`, // Simple SKU generation
                product_images: {
                    create: images && Array.isArray(images) ? images.map((url: string, index: number) => ({
                        image_url: url,
                        display_order: index
                    })) : []
                }
            }
        });
        res.status(201).json(product);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Failed to add product' });
    }
});

// Update Product
router.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock_quantity, category_id, image_url, images } = req.body;

        const product = await prisma.$transaction(async (prisma) => {
            const updatedProduct = await prisma.products.update({
                where: { product_id: id },
                data: {
                    name,
                    description,
                    price: price ? Number(price) : undefined,
                    stock_quantity: stock_quantity ? Number(stock_quantity) : undefined,
                    category_id: category_id || null,
                    image_url
                }
            });

            if (images && Array.isArray(images)) {
                // Delete existing images
                await prisma.product_images.deleteMany({
                    where: { product_id: id }
                });

                // Create new images
                if (images.length > 0) {
                    await prisma.product_images.createMany({
                        data: images.map((url: string, index: number) => ({
                            product_id: id,
                            image_url: url,
                            display_order: index
                        }))
                    });
                }
            }

            return updatedProduct;
        });
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product' });
    }
});

// Delete Product
router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.products.delete({ where: { product_id: id } });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

// --- Orders ---

// Get All Orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                users: { select: { first_name: true, last_name: true, email: true } },
                order_items: { include: { products: true } }
            },
            orderBy: { order_date: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// Update Order Status
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await prisma.orders.update({
            where: { order_id: id },
            data: { status }
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status' });
    }
});

// --- Categories ---

// Add Category
router.post('/categories', async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await prisma.categories.create({
            data: { name, description }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add category' });
    }
});

export default router;
