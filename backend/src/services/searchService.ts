import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apiKey = process.env.OPENAI_API_KEY;

let openai: OpenAI | null = null;

if (apiKey) {
    openai = new OpenAI({
        apiKey: apiKey,
        baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        defaultHeaders: {
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Luxe E-commerce",
        }
    });
}

interface ProductEmbedding {
    id: string;
    text: string;
    embedding: number[];
    product: any;
}

let productIndex: ProductEmbedding[] = [];

// Helper to calculate Cosine Similarity
const cosineSimilarity = (vecA: number[], vecB: number[]) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const initializeSearchIndex = async () => {
    if (!openai) {
        console.log("Skipping Search Index initialization: No OpenAI API Key found.");
        return;
    }

    console.log("Initializing Semantic Search Index...");
    try {
        const products = await prisma.products.findMany({
            where: { is_active: true },
            include: { categories: true }
        });

        const embeddings: ProductEmbedding[] = [];

        for (const product of products) {
            // Create a rich text representation of the product
            const textToEmbed = `
                Title: ${product.name}
                Category: ${product.categories?.name || 'Uncategorized'}
                Description: ${product.description || ''}
                Price: ${product.price}
            `.trim();

            try {
                const response = await openai.embeddings.create({
                    model: "text-embedding-3-small",
                    input: textToEmbed,
                });

                const embedding = response.data[0].embedding;
                embeddings.push({
                    id: product.product_id,
                    text: textToEmbed,
                    embedding: embedding,
                    product: product
                });
            } catch (err) {
                console.error(`Failed to embed product ${product.name}:`, err);
            }
        }

        productIndex = embeddings;
        console.log(`Search Index initialized with ${productIndex.length} products.`);
    } catch (error) {
        console.error("Failed to initialize search index:", error);
    }
};

export const searchProducts = async (query: string) => {
    if (!openai || productIndex.length === 0) {
        // Fallback to basic database search if AI is not ready
        console.log("Falling back to basic DB search");
        return await prisma.products.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ],
                is_active: true
            },
            take: 10
        });
    }

    try {
        // Embed the user query
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: query,
        });
        const queryEmbedding = response.data[0].embedding;

        // Calculate similarity for all products
        const results = productIndex.map(item => ({
            product: item.product,
            score: cosineSimilarity(queryEmbedding, item.embedding)
        }));

        // Sort by score (descending) and take top 10
        results.sort((a, b) => b.score - a.score);

        // Return only the products, filtering out low relevance if needed
        return results.slice(0, 10).map(r => r.product);

    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
};

export const getRecommendations = async (productIds: string[]) => {
    if (!openai || productIndex.length === 0) {
        // Fallback: Return random products if AI is not ready
        return await prisma.products.findMany({
            where: { is_active: true },
            take: 8,
            orderBy: { created_at: 'desc' }
        });
    }

    try {
        // 1. Find embeddings for the viewed products
        const viewedEmbeddings = productIndex
            .filter(item => productIds.includes(item.id))
            .map(item => item.embedding);

        if (viewedEmbeddings.length === 0) {
            // If no valid viewed products found, return popular/random
            return await prisma.products.findMany({
                where: { is_active: true },
                take: 8
            });
        }

        // 2. Calculate average embedding (User Profile Vector)
        const userVector = viewedEmbeddings[0].map((_, i) => {
            const sum = viewedEmbeddings.reduce((acc, curr) => acc + curr[i], 0);
            return sum / viewedEmbeddings.length;
        });

        // 3. Find similar products
        const results = productIndex
            .filter(item => !productIds.includes(item.id)) // Exclude already viewed
            .map(item => ({
                product: item.product,
                score: cosineSimilarity(userVector, item.embedding)
            }));

        // 4. Sort and return top 8
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, 8).map(r => r.product);

    } catch (error) {
        console.error("Recommendation error:", error);
        return [];
    }
};
