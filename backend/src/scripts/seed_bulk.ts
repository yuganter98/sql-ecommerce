
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const accessories = [
    { name: 'Leather Weekend Bag', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600' },
    { name: 'Classic Aviator Sunglasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600' },
    { name: 'Minimalist Wallet', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600' },
    { name: 'Gold Chain Necklace', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=600' },
    { name: 'Silk Scarf', image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4faae?auto=format&fit=crop&q=80&w=600' },
    { name: 'Leather Belt', image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80&w=600' },
    { name: 'Wool Beanie', image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=600' },
    { name: 'Canvas Tote Bag', image: 'https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?auto=format&fit=crop&q=80&w=600' },
    { name: 'Digital Wristwatch', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600' },
    { name: 'Pearl Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600' },
    { name: 'Travel Backpack', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600' }, // Reuse bag
    { name: 'Designer Cap', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Silver Ring Set', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600' },
    { name: 'Leather Gloves', image: 'https://images.unsplash.com/photo-1584671457493-272e616f0ca2?auto=format&fit=crop&q=80&w=600' },
    { name: 'Laptop Sleeve', image: 'https://images.unsplash.com/photo-1537243361817-2fb5633a69dc?auto=format&fit=crop&q=80&w=600' },
    { name: 'Phone Case', image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=600' },
    { name: 'Key Organizer', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600' },
    { name: 'Travel Pillow', image: 'https://images.unsplash.com/photo-1520606611354-2c1b18d264f3?auto=format&fit=crop&q=80&w=600' }
];

const clothing = [
    { name: 'Oversized Denim Jacket', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Cashmere Sweater', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600' },
    { name: 'Linen Trousers', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=600' }, // Reusing diverse image
    { name: 'Graphic Print T-Shirt', image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=600' },
    { name: 'Summer Floral Dress', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Slim Fit Chinos', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600' }
];

const home = [
    { name: 'Ceramic Vase Set', image: 'https://images.unsplash.com/photo-1581783342308-f792ca11df53?auto=format&fit=crop&q=80&w=600' },
    { name: 'Abstract Wall Art', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600' },
    { name: 'Velvet Throw Pillow', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&q=80&w=600' },
    { name: 'Scented Soy Candle', image: 'https://images.unsplash.com/photo-1602825389696-058d48733350?auto=format&fit=crop&q=80&w=600' },
    { name: 'Modern Table Lamp', image: 'https://images.unsplash.com/photo-1507473888900-52e1adad54cd?auto=format&fit=crop&q=80&w=600' },
    { name: 'Indoor Pot Plant', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600' },
    { name: 'Kitchen Knife Set', image: 'https://images.unsplash.com/photo-1593618998160-e34015e67543?auto=format&fit=crop&q=80&w=600' },
    { name: 'Bamboo Cutting Board', image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&q=80&w=600' }, // Reusing kitchen element
    { name: 'Espresso Machine', image: 'https://images.unsplash.com/photo-1520981825232-ece5fae45120?auto=format&fit=crop&q=80&w=600' },
    { name: 'Smart Thermostat', image: 'https://images.unsplash.com/photo-1563456078-43845b1cc8c9?auto=format&fit=crop&q=80&w=600' }, // Reusing generic tech/home
    { name: 'Robot Vacuum Cleaner', image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=600' }, // Reusing tech
    { name: 'Luxury Bed Sheets', image: 'https://images.unsplash.com/photo-1522771753035-0a153950c76b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Bath Towel Set', image: 'https://images.unsplash.com/photo-1565452399201-14c379a25039?auto=format&fit=crop&q=80&w=600' }, // Reusing towel/home
    { name: 'Garden Tools Set', image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&q=80&w=600' },
    { name: 'Outdoor String Lights', image: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&q=80&w=600' },
    { name: 'Patio Chair', image: 'https://images.unsplash.com/photo-1592652426685-6e7e4eb47799?auto=format&fit=crop&q=80&w=600' }, // Reusing chair
    { name: 'BBQ Grill Set', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600' }
];

const shoes = [
    { name: 'Running Performance X', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600' },
    { name: 'Urban Street Sneakers', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=600' },
    { name: 'Classic Loafers', image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&q=80&w=600' },
    { name: 'High-Top Boots', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=600' },
    { name: 'Canvas Slip-Ons', image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&q=80&w=600' },
    { name: 'Hiking Trekking Boots', image: 'https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&q=80&w=600' },
    { name: 'Formal Oxford Shoes', image: 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&q=80&w=600' },
    { name: 'Sport Sandals', image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Retro Court Kicks', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600' },
    { name: 'Lightweight Trainers', image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=600' },
    { name: 'Winter Snow Boots', image: 'https://images.unsplash.com/photo-1542840410-b74a383d463d?auto=format&fit=crop&q=80&w=600' }, // Reusing boots
    { name: 'Leather Ankle Boots', image: 'https://images.unsplash.com/photo-1605763240004-7e93b172d765?auto=format&fit=crop&q=80&w=600' },
    { name: 'Skate Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600' },
    { name: 'Trail Runners', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600' },
    { name: 'Minimalist Sneakers', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600' },
    { name: 'Platform Shoes', image: 'https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5?auto=format&fit=crop&q=80&w=600' }, // Reusing
    { name: 'Driving Moccasins', image: 'https://images.unsplash.com/photo-1617606002806-94e279c22567?auto=format&fit=crop&q=80&w=600' },
    { name: 'Espadrilles', image: 'https://images.unsplash.com/photo-1535043934128-cf0b27d52f95?auto=format&fit=crop&q=80&w=600' },
    { name: 'Athletic Cleats', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=600' }
];

const sports = [
    { name: 'Yoga Mat Premium', image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a9?auto=format&fit=crop&q=80&w=600' },
    { name: 'Dumbbell Set 10kg', image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=600' },
    { name: 'Tennis Racket Pro', image: 'https://images.unsplash.com/photo-1626248107765-a82d0263c355?auto=format&fit=crop&q=80&w=600' }, // Reusing Racket
    { name: 'Basketball Official', image: 'https://images.unsplash.com/photo-1519861531473-9200263df374?auto=format&fit=crop&q=80&w=600' },
    { name: 'Swimming Goggles', image: 'https://images.unsplash.com/photo-1562546416-52c7921867c4?auto=format&fit=crop&q=80&w=600' }, // Reusing water/pool
    { name: 'Cycling Helmet', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600' },
    { name: 'Soccer Ball FIFA', image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&q=80&w=600' },
    { name: 'Resistance Bands', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&q=80&w=600' },
    { name: 'Foam Roller', image: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?auto=format&fit=crop&q=80&w=600' },
    { name: 'Jump Rope Speed', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=600' },
    { name: 'Boxing Gloves', image: 'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?auto=format&fit=crop&q=80&w=600' },
    { name: 'Golf Club Driver', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Skateboard Deck', image: 'https://images.unsplash.com/photo-1520045864981-8c47571971f3?auto=format&fit=crop&q=80&w=600' },
    { name: 'Surfboard Short', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=600' }, // Water/surf
    { name: 'Protein Shaker Bottle', image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&q=80&w=600' },
    { name: 'Sports Headband', image: 'https://images.unsplash.com/photo-1562771379-e71d2b123384?auto=format&fit=crop&q=80&w=600' }, // Reusing fabric
    { name: 'Badminton Set', image: 'https://images.unsplash.com/photo-1613919113640-1373343a2946?auto=format&fit=crop&q=80&w=600' },
    { name: 'Volleyball Pro', image: 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&q=80&w=600' },
    { name: 'Hiking Poles', image: 'https://images.unsplash.com/photo-1523475496153-3d608f6dedf9?auto=format&fit=crop&q=80&w=600' } // Nature
];

async function seedCategory(categoryName: string, items: any[]) {
    // 1. Get Category ID
    const category = await prisma.categories.findFirst({ where: { name: categoryName } });
    if (!category) {
        console.error(`Category ${categoryName} not found!`);
        return;
    }

    console.log(`Seeding ${items.length} items into ${categoryName}...`);

    for (const item of items) {
        const sku = `${categoryName.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        await prisma.products.create({
            data: {
                name: item.name,
                description: `High quality ${item.name} ideal for your needs. Premium materials and excellent craftsmanship.`,
                price: Math.floor(Math.random() * 150) + 20,
                stock_quantity: Math.floor(Math.random() * 50) + 5,
                sku: sku,
                image_url: item.image,
                category_id: category.category_id,
                is_active: true
            }
        });
    }
}

async function main() {
    await seedCategory('Accessories', accessories);
    await seedCategory('Clothing', clothing);
    await seedCategory('Home & Garden', home);
    await seedCategory('Shoes', shoes);
    await seedCategory('Sports', sports);

    console.log('Bulk seeding complete!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
