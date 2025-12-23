import { Request, Response } from 'express';
import { searchProducts } from '../services/searchService';

export const search = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;

        if (!query) {
            res.status(400).json({ error: 'Query parameter "q" is required' });
            return;
        }

        const results = await searchProducts(query);
        res.json(results);
    } catch (error) {
        console.error('Search Controller Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
