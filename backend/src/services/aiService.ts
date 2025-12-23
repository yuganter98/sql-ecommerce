import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

let openai: OpenAI | null = null;

if (apiKey) {
    openai = new OpenAI({
        apiKey: apiKey,
        baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        defaultHeaders: {
            "HTTP-Referer": "http://localhost:5173", // Optional: For OpenRouter rankings
            "X-Title": "Luxe E-commerce", // Optional: For OpenRouter rankings
        }
    });
}

const SYSTEM_PROMPT = `
You are a helpful and polite customer support assistant for "Luxe", a premium e-commerce store.
Your goal is to assist customers with their questions about products, orders, shipping, and policies.

Store Information:
- Name: Luxe
- Tagline: Redefine Your Signature Style.
- Products: Premium clothing, electronics, home & garden, sports equipment.
- Shipping: Free shipping on all orders.
- Warranty: 2-year warranty on all products.
- Returns: 30-day return policy.
- Contact: support@luxe.com

Guidelines:
- Be concise and professional.
- If you don't know the answer, gently suggest contacting support@luxe.com.
- Do not invent non-existent products or policies.
- If asked about technical details of the website, you can mention it's built with React, Node.js, and PostgreSQL.
`;

export const generateResponse = async (message: string): Promise<string> => {
    if (!openai) {
        return "I'm currently in demo mode because my AI brain (OpenAI API Key) hasn't been configured yet. Please add an OPENAI_API_KEY to the backend .env file to chat with me for real!";
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: message },
            ],
            model: "gpt-3.5-turbo",
        });

        return completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return "I'm having trouble connecting to my AI brain right now. Please try again later.";
    }
};

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
    if (!openai) {
        return "This is a demo description generated because no OpenAI API Key was found. Please add OPENAI_API_KEY to your backend .env file to generate real descriptions.";
    }

    const prompt = `Write a compelling, premium product description for a product named "${name}" in the category "${category}". Keep it under 100 words. Highlight quality and style.`;

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a professional copywriter for a luxury e-commerce brand." },
                { role: "user", content: prompt },
            ],
            model: "gpt-3.5-turbo",
        });

        return completion.choices[0].message.content || "Could not generate description.";
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return "Error generating description. Please try again.";
    }
};

import { searchProducts } from './searchService';

export const personalShopperChat = async (messages: any[]): Promise<{ response: string; products?: any[] }> => {
    if (!openai) {
        return { response: "I'm currently in demo mode. Please configure the OpenAI API Key to use the Personal Shopper." };
    }

    const SYSTEM_PROMPT_SHOPPER = `
    You are a Personal Shopper for "Luxe", a premium e-commerce store.
    Your goal is to help customers find the perfect product by asking clarifying questions (budget, style, occasion, etc.).
    
    Process:
    1. Ask questions to understand the user's needs.
    2. Once you have enough information to make a recommendation, output a special search query line.
    3. The format MUST be: "SEARCH_QUERY: <search terms>"
    4. Follow the search query with a polite message introducing the products.
    
    Example:
    User: "I need a dress for a wedding."
    You: "What is your budget and do you prefer a specific color?"
    User: "Under $200, red or black."
    You: "SEARCH_QUERY: red black dress under 200
    Here are some stunning options I found for you:"
    
    Keep your responses concise, friendly, and helpful.
    `;

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT_SHOPPER },
                ...messages
            ],
            model: "gpt-3.5-turbo",
        });

        const content = completion.choices[0].message.content || "I'm sorry, I couldn't understand that.";

        // Check for search query
        const searchMatch = content.match(/SEARCH_QUERY:\s*(.*)/);

        if (searchMatch) {
            const query = searchMatch[1].trim();
            const products = await searchProducts(query);

            // Remove the SEARCH_QUERY line from the response shown to user
            const cleanResponse = content.replace(/SEARCH_QUERY:.*\n?/, '').trim();

            return { response: cleanResponse, products };
        }

        return { response: content };

    } catch (error) {
        console.error("Personal Shopper API Error:", error);
        return { response: "I'm having trouble connecting to my AI brain right now." };
    }
};
