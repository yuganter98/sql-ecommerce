import { useRef } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
}

interface FeaturedCarouselProps {
    title: string;
    products: Product[];
    variant?: 'light' | 'dark';
}

const FeaturedCarousel = ({ title, products, variant = 'light' }: FeaturedCarouselProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const textColor = variant === 'dark' ? 'text-white' : 'text-gray-900';
    const buttonBorder = variant === 'dark' ? 'border-white/20 hover:bg-white/10 text-white' : 'border-gray-200 hover:bg-gray-100 text-gray-900';

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className={`text-2xl md:text-3xl font-bold ${textColor}`}>{title}</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className={`p-2 rounded-full border transition-colors ${buttonBorder}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className={`p-2 rounded-full border transition-colors ${buttonBorder}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                            <ProductCard {...product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCarousel;
