import { Request, Response } from 'express';
import { getRecommendations } from '../services/searchService';

export const getRecommendedProducts = async (req: Request, res: Response) => {
    try {
        const { productIds } = req.body;

        if (!Array.isArray(productIds)) {
            res.status(400).json({ error: 'productIds must be an array' });
            return;
        }

        const recommendations = await getRecommendations(productIds);
        res.json(recommendations);
    } catch (error) {
        console.error('Recommendation Controller Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
