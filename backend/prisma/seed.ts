import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Create Categories
    const electronics = await prisma.categories.create({
        data: {
            name: 'Electronics',
            description: 'Gadgets and devices',
        },
    });

    const clothing = await prisma.categories.create({
        data: {
            name: 'Clothing',
            description: 'Apparel and fashion',
        },
    });

    const home = await prisma.categories.create({
        data: {
            name: 'Home & Garden',
            description: 'Furniture and decor',
        },
    });

    const sports = await prisma.categories.create({
        data: {
            name: 'Sports',
            description: 'Sporting goods and equipment',
        },
    });

    // Products Data
    const products = [
        // Electronics
        {
            name: 'Wireless Noise Cancelling Headphones',
            description: 'Premium noise cancelling headphones with 30-hour battery life.',
            price: 299.99,
            stock_quantity: 50,
            category_id: electronics.category_id,
            image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
            sku: 'AUDIO-001'
        },
        {
            name: 'Smart Watch Series 5',
            description: 'Advanced health monitoring and fitness tracking.',
            price: 399.99,
            stock_quantity: 30,
            category_id: electronics.category_id,
            image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
            sku: 'WEAR-001'
        },
        {
            name: '4K Ultra HD Camera',
            description: 'Professional grade camera for stunning photography.',
            price: 899.99,
            stock_quantity: 15,
            category_id: electronics.category_id,
            image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
            sku: 'CAM-001'
        },
        {
            name: 'Gaming Laptop Pro',
            description: 'High performance laptop for gaming and creative work.',
            price: 1499.99,
            stock_quantity: 10,
            category_id: electronics.category_id,
            image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80',
            sku: 'COMP-001'
        },
        {
            name: 'Bluetooth Speaker',
            description: 'Portable speaker with deep bass and waterproof design.',
            price: 79.99,
            stock_quantity: 100,
            category_id: electronics.category_id,
            image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
            sku: 'AUDIO-002'
        },

        // Clothing
        {
            name: 'Classic Denim Jacket',
            description: 'Timeless denim jacket for casual style.',
            price: 59.99,
            stock_quantity: 40,
            category_id: clothing.category_id,
            image_url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80',
            sku: 'CLOTH-001'
        },
        {
            name: 'Cotton Crew Neck T-Shirt',
            description: 'Soft and comfortable essential t-shirt.',
            price: 19.99,
            stock_quantity: 200,
            category_id: clothing.category_id,
            image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
            sku: 'CLOTH-002'
        },
        {
            name: 'Running Sneakers',
            description: 'Lightweight sneakers for daily running and training.',
            price: 89.99,
            stock_quantity: 60,
            category_id: clothing.category_id,
            image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
            sku: 'SHOE-001'
        },
        {
            name: 'Leather Wallet',
            description: 'Genuine leather wallet with multiple card slots.',
            price: 49.99,
            stock_quantity: 80,
            category_id: clothing.category_id,
            image_url: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?w=500&q=80',
            sku: 'ACC-001'
        },
        {
            name: 'Summer Sunglasses',
            description: 'Stylish sunglasses with UV protection.',
            price: 129.99,
            stock_quantity: 45,
            category_id: clothing.category_id,
            image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
            sku: 'ACC-002'
        },

        // Home
        {
            name: 'Modern Desk Lamp',
            description: 'Adjustable LED desk lamp with touch control.',
            price: 39.99,
            stock_quantity: 70,
            category_id: home.category_id,
            image_url: 'https://images.unsplash.com/photo-1507473888900-52e1adad5420?w=500&q=80',
            sku: 'HOME-001'
        },
        {
            name: 'Ceramic Plant Pot',
            description: 'Minimalist ceramic pot for indoor plants.',
            price: 24.99,
            stock_quantity: 90,
            category_id: home.category_id,
            image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80',
            sku: 'HOME-002'
        },
        {
            name: 'Soft Throw Blanket',
            description: 'Cozy throw blanket for your sofa or bed.',
            price: 34.99,
            stock_quantity: 55,
            category_id: home.category_id,
            image_url: 'https://images.unsplash.com/photo-1580301762395-9c64265e9c5d?w=500&q=80',
            sku: 'HOME-003'
        },
        {
            name: 'Aromatic Candle',
            description: 'Scented candle with natural soy wax.',
            price: 15.99,
            stock_quantity: 120,
            category_id: home.category_id,
            image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80',
            sku: 'HOME-004'
        },
        {
            name: 'Kitchen Knife Set',
            description: 'Professional chef knife set with wooden block.',
            price: 149.99,
            stock_quantity: 25,
            category_id: home.category_id,
            image_url: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&q=80',
            sku: 'KITCH-001'
        },

        // Sports
        {
            name: 'Yoga Mat',
            description: 'Non-slip yoga mat for home workouts.',
            price: 29.99,
            stock_quantity: 85,
            category_id: sports.category_id,
            image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80',
            sku: 'SPORT-001'
        },
        {
            name: 'Dumbbell Set',
            description: 'Adjustable dumbbell set for strength training.',
            price: 89.99,
            stock_quantity: 20,
            category_id: sports.category_id,
            image_url: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&q=80',
            sku: 'SPORT-002'
        },
        {
            name: 'Tennis Racket',
            description: 'Professional tennis racket for intermediate players.',
            price: 119.99,
            stock_quantity: 15,
            category_id: sports.category_id,
            image_url: 'https://images.unsplash.com/photo-1617083934555-563404543d35?w=500&q=80',
            sku: 'SPORT-003'
        },
        {
            name: 'Basketball',
            description: 'Official size and weight basketball.',
            price: 24.99,
            stock_quantity: 60,
            category_id: sports.category_id,
            image_url: 'https://images.unsplash.com/photo-1519861531473-9200263931a2?w=500&q=80',
            sku: 'SPORT-004'
        },
        {
            name: 'Cycling Helmet',
            description: 'Safety helmet for road and mountain biking.',
            price: 45.99,
            stock_quantity: 40,
            category_id: sports.category_id,
            image_url: 'https://images.unsplash.com/photo-1557803175-215e6bc31eb2?w=500&q=80',
            sku: 'SPORT-005'
        }
    ];

    for (const product of products) {
        await prisma.products.create({
            data: product,
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
