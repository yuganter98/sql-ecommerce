import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
    name: string;
    image: string;
    count: number;
    className?: string;
}

import { Link } from 'react-router-dom';

const CategoryCard = ({ name, image, count, className = '' }: CategoryCardProps) => {
    return (
        <Link to={`/products?category=${name}`} className={`block ${className}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="relative group cursor-pointer overflow-hidden rounded-2xl h-full shadow-md hover:shadow-xl transition-all duration-300"
            >
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold mb-2 font-heading">{name}</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-300 font-medium">{count} Products</p>
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                            <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default CategoryCard;
