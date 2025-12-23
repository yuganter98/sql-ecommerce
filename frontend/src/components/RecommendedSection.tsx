import { useEffect, useState } from 'react';
import client from '../api/client';
import FeaturedCarousel from './FeaturedCarousel';

const RecommendedSection = () => {
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

            if (viewed.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const res = await client.post('/recommendations', { productIds: viewed });
                const mappedProducts = res.data.map((p: any) => ({
                    ...p,
                    id: p.product_id,
                    title: p.name,
                    price: Number(p.price),
                    image: p.image_url || 'https://via.placeholder.com/300',
                    category: p.categories?.name || 'Uncategorized'
                }));
                setRecommendations(mappedProducts);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading || recommendations.length === 0) {
        return null;
    }

    return (
        <FeaturedCarousel title="Recommended for You" products={recommendations} />
    );
};

export default RecommendedSection;
