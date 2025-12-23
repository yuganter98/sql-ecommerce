import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import Button from './ui/Button';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { motion } from 'framer-motion';

interface ProductCardProps {
    id: string | number;
    title: string;
    price: number;
    image: string;
    rating?: number;
    category?: string;
}

const ProductCard = ({ id, title, price, image, rating = 4.5, category }: ProductCardProps) => {
    const addItem = useCartStore((state) => state.addItem);
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
    const isWishlisted = isInWishlist(id.toString());

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isWishlisted) {
            removeFromWishlist(id.toString());
        } else {
            addToWishlist({
                id: id.toString(),
                title,
                price,
                image,
                category
            });
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation(); // Stop event bubbling
        addItem({
            product_id: id.toString(),
            name: title,
            price: price,
            image_url: image,
            description: '',
            stock_quantity: 0,
            created_at: new Date().toISOString()
        }, 1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
        >
            <Link to={`/products/${id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        src={image}
                        alt={title}
                        className="w-full h-full object-contain p-4"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 pointer-events-none z-10">
                        {category && (
                            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-md text-gray-900 shadow-sm">
                                {category}
                            </span>
                        )}
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent pt-12 z-10">
                        <Button
                            onClick={handleAddToCart}
                            className="w-full bg-primary text-white hover:bg-primary/90 border-none shadow-lg transform active:scale-95 transition-all"
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                        </Button>
                    </div>

                    <button
                        onClick={handleWishlist}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 z-10 ${isWishlisted
                            ? 'bg-red-50 text-red-500'
                            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-500">{rating}</span>
                        </div>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1 truncate font-heading">{title}</h3>
                    <p className="text-lg font-bold text-gray-900">${price.toFixed(2)}</p>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
