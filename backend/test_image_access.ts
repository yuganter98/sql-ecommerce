
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const product = await prisma.products.findFirst({
        where: { name: 'Canvas Tote Bag' }
    });

    if (!product || !product.image_url) {
        console.log('No URL to test.');
        return;
    }

    console.log(`Testing URL: ${product.image_url}`);

    try {
        const response = await axios.get(product.image_url);
        console.log(`Success! Status: ${response.status}`);
        console.log(`Content-Type: ${response.headers['content-type']}`);
        console.log(`Content Length: ${response.headers['content-length']}`);
    } catch (error: any) {
        console.error('Failed to fetch image:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
