import { Request, Response } from 'express';
import { generateResponse, generateProductDescription, personalShopperChat } from '../services/aiService';

export const chatWithAI = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        const response = await generateResponse(message);
        res.json({ response });
    } catch (error) {
        console.error('Chat Controller Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const generateDescription = async (req: Request, res: Response) => {
    try {
        const { name, category } = req.body;

        if (!name || !category) {
            res.status(400).json({ error: 'Name and category are required' });
            return;
        }

        const description = await generateProductDescription(name, category);
        res.json({ description });
    } catch (error) {
        console.error('Description Generation Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const personalShopper = async (req: Request, res: Response) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            res.status(400).json({ error: 'Messages array is required' });
            return;
        }

        const result = await personalShopperChat(messages);
        res.json(result);
    } catch (error) {
        console.error('Personal Shopper Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
