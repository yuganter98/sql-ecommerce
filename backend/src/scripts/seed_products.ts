
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
    {
        name: 'Electronics',
        description: 'Latest gadgets, headphones, cameras, and more.',
        image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&q=80&w=1000',
        has_sizes: false,
    },
    {
        name: 'Shoes',
        description: 'Trending sneakers, running shoes, and boots.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000',
        has_sizes: true,
    },
    {
        name: 'Accessories',
        description: 'Backpacks, sunglasses, and everyday carry items.',
        image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=1000',
        has_sizes: false,
    },
    {
        name: 'Clothing',
        description: 'Premium apparel for men and women.',
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1000',
        has_sizes: true,
    },
    {
        name: 'Home & Garden',
        description: 'Elevate your living space.',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=1000',
        has_sizes: false,
    }
];

const products = [
    // ELECTRONICS
    {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'The best noise-canceling headphones on the market. Features industry-leading noise cancellation, exceptional sound quality with LDAC support, and crystal-clear hands-free calling. Up to 30 hours of battery life.',
        price: 348.00,
        category: 'Electronics',
        sku: 'SONY-XM5-BLK',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000',
        product_images: [
            'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=1000'
        ]
    }, // Replaced broken image with verified Unsplash headphones
    {
        name: 'Fujifilm X100VI Digital Camera',
        description: 'The ultimate premium compact camera. Features a 40MP X-Trans CMOS 5 HR sensor, in-body image stabilization, and the iconic retro design. Perfect for street photography and travel.',
        price: 1599.00,
        category: 'Electronics',
        sku: 'FUJI-X100VI-SIL',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
        product_images: [
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000'
        ]
    },
    {
        name: 'Apple Watch Series 9',
        description: 'Smarter, brighter, and mightier. Features the new S9 SiP, a double-tap gesture, and a brighter display. Advanced health sensors for heart rate, blood oxygen, and sleep tracking.',
        price: 399.00,
        category: 'Electronics',
        sku: 'AAPL-WATCH-S9',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1000',
        product_images: [
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1000'
        ]
    },
    {
        name: 'Ray-Ban Meta Smart Glasses',
        description: 'The next generation of smart glasses. Capture photos and videos, listen to music, and take calls, all while staying present in the moment. Features AI integration and a sleek Wayfarer design.',
        price: 299.00,
        category: 'Electronics',
        sku: 'RAYBAN-META-BLK',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    },
    {
        name: 'Samsung Galaxy Z Fold 6',
        description: 'Unfold your world. The lightest, most compact Galaxy Z Fold yet. Features a massive 7.6-inch main display, powerful Snapdragon 8 Gen 3 processor, and Galaxy AI features.',
        price: 1899.00,
        category: 'Electronics',
        sku: 'SAMSUNG-FOLD6',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    },

    // SHOES
    {
        name: 'Adidas Samba OG',
        description: 'A street-style icon. Born on the pitch, the Samba is a timeless classic featuring soft leather upper and suede overlays. The gum rubber outsole adds a retro touch.',
        price: 100.00,
        category: 'Shoes',
        sku: 'ADI-SAMBA-WHT',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1000',
        product_images: [
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1000'
        ]
    }, // Generic Nike/Adidas vibe
    {
        name: 'Nike Air Jordan 4 Retro "Bred Reimagined"',
        description: 'The legend returns. This reimagined classic features a premium leather upper replacing the original nubuck, while keeping the iconic black and red colorway known as "Bred".',
        price: 215.00,
        category: 'Shoes',
        sku: 'NIKE-AJ4-BRED',
        image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    },
    {
        name: 'New Balance 9060',
        description: 'A new expression of refined style and innovation-led design. The 9060 reinterprets familiar elements from classic 99X models with a warped sensibility inspired by the tech aesthetic of the Y2K era.',
        price: 149.99,
        category: 'Shoes',
        sku: 'NB-9060-GRY',
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    },
    {
        name: 'Hoka Clifton 9',
        description: 'The daily miles workhorse. Lighter and more cushioned than ever before. Eliminating weight while adding 3mm in stack height, the new Clifton 9 delivers a revitalized underfoot experience.',
        price: 145.00,
        category: 'Shoes',
        sku: 'HOKA-CLIFTON9',
        image: 'https://images.unsplash.com/photo-1555276921-2bea35165604?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    },

    // ACCESSORIES
    {
        name: 'Herschel Little America Backpack',
        description: 'A popular mountaineering silhouette, the Little America backpack elevates an iconic style with modern functionality. Features a padded fleece-lined laptop sleeve and magnetic strap closures.',
        price: 129.99,
        category: 'Accessories',
        sku: 'HERSCH-LILAM',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    },
    {
        name: 'Ray-Ban Aviator Classic',
        description: 'Currently one of the most iconic sunglass models in the world. Originally designed for U.S. Aviators in 1937. Aviator Classic sunglasses are a timeless model that combines great aviator styling with exceptional quality.',
        price: 163.00,
        category: 'Accessories',
        sku: 'RAYBAN-AVIATOR',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    },
    {
        name: 'Stanley Quencher H2.0 FlowState',
        description: 'The viral tumbler that started it all. Constructed of recycled stainless steel for sustainable sipping, this 40 oz Quencher offers maximum hydration with fewer refills.',
        price: 45.00,
        category: 'Accessories',
        sku: 'STANLEY-40OZ',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=1000', // Cup/Coffee vibe
        product_images: []
    },
    {
        name: 'Everywhere Belt Bag 1L',
        description: 'Phone, keys, wallet. Keep them close in this versatile belt bag that helps you get out the door and on to your next adventure.',
        price: 38.00,
        category: 'Accessories',
        sku: 'LULU-BELTBAG',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=1000', // Bag vibe
        product_images: []
    },

    // CLOTHING
    {
        name: 'Essentials Fear of God Hoodie',
        description: 'The Essentials Hoodie via Fear of God is a relaxed fit pullover hoodie with dropped shoulders and a kangaroo pocket. Made from a heavy cotton blend fleece.',
        price: 90.00,
        category: 'Clothing',
        sku: 'FOG-HOODIE-BLK',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    },
    {
        name: 'Levi\'s 501 Original Fit Jeans',
        description: 'The blueprint for every pair of jeans in existence—Levi\'s 501 Original Fit Jeans. A cultural icon with the signature button fly and straight leg fit.',
        price: 79.50,
        category: 'Clothing',
        sku: 'LEVI-501-BLU',
        image: 'https://images.unsplash.com/photo-1542272617-08f086303b96?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    },
    {
        name: 'Ralph Lauren Oxford Shirt',
        description: 'This trim version of the Oxford shirt is garment-dyed and washed for a broken-in look and feel. Signature embroidered Pony at the left chest.',
        price: 98.50,
        category: 'Clothing',
        sku: 'RL-OXFORD-WHT',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    },

    // HOME & GARDEN
    {
        name: 'Dyson V15 Detect Vacuum',
        description: 'Dyson\'s most powerful, intelligent cordless vacuum. Laser reveals microscopic dust. LCD screen shows what you suck up.',
        price: 749.99,
        category: 'Home & Garden',
        sku: 'DYSON-V15',
        image: 'https://images.unsplash.com/photo-1558317374-a35498f3ffd2?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    },
    {
        name: 'Eames Lounge Chair & Ottoman',
        description: 'A timeless classic of modern design using molded plywood and leather. The Eames Lounge Chair is widely considered one of the most significant designs of the 20th century.',
        price: 6495.00,
        category: 'Home & Garden',
        sku: 'EAMES-LOUNGE',
        image: 'https://images.unsplash.com/photo-1567538096630-e0cb5694b159?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    },
    {
        name: 'Monstera Deliciosa Plant',
        description: 'The Swiss Cheese Plant. Famous for its natural leaf holes. A statement piece for any room. easy to care for and fast growing.',
        price: 45.00,
        category: 'Home & Garden',
        sku: 'PLANT-MONSTERA',
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=1000',
        product_images: []
    }
];

async function main() {
    console.log('Seeding curated products...');

    // 1. Seed Categories
    for (const cat of categories) {
        await prisma.categories.upsert({
            where: { category_id: undefined }, // This is tricky with UUIDs, better to findByName first or just create if not exists using findFirst
            update: {},
            create: {
                name: cat.name,
                description: cat.description,
                has_sizes: cat.has_sizes,
                // We'll skip image for category table as it's not in my schema view above but if it is I'd add it
                // Checking schema... schema says `categories` has `name`, `description`, `parent_id`, `has_sizes`. No image_url column in categories table?
                // Wait, Home.tsx uses `cat.image`? Ah, Home.tsx uses hardcoded `categoryImages` map! The DB doesn't have it.
                // So we are good.
            }
        }).catch(async (e) => {
            // Fallback if upsert fails or checking existence manually
            const existing = await prisma.categories.findFirst({ where: { name: cat.name } });
            if (!existing) {
                await prisma.categories.create({
                    data: {
                        name: cat.name,
                        description: cat.description,
                        has_sizes: cat.has_sizes
                    }
                });
            }
        });
    }

    // 2. Fetch Category IDs
    const cats = await prisma.categories.findMany();
    const catMap = new Map(cats.map(c => [c.name, c.category_id]));

    // 3. Seed Products
    for (const product of products) {
        const categoryId = catMap.get(product.category);
        if (!categoryId) {
            console.warn(`Category ${product.category} not found for ${product.name}`);
            continue;
        }

        const existingProduct = await prisma.products.findUnique({
            where: { sku: product.sku }
        });

        if (!existingProduct) {
            const newProduct = await prisma.products.create({
                data: {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock_quantity: Math.floor(Math.random() * 50) + 10, // Random stock 10-60
                    sku: product.sku,
                    image_url: product.image,
                    category_id: categoryId,
                    is_active: true
                }
            });
            console.log(`Created product: ${product.name}`);

            // Seed additional images if any
            if (product.product_images && product.product_images.length > 0) {
                for (const imgUrl of product.product_images) {
                    await prisma.product_images.create({
                        data: {
                            product_id: newProduct.product_id,
                            image_url: imgUrl,
                            display_order: 0
                        }
                    });
                }
            }
        } else {
            console.log(`Product ${product.name} already exists. Skipping.`);
        }
    }

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
