import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/ProductCard';
import Button from '../components/ui/Button';
import { Heart } from 'lucide-react';

const Wishlist = () => {
    const { items } = useWishlistStore();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-gray-100 p-6 rounded-full">
                        <Heart className="w-12 h-12 text-gray-400" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Your Wishlist is Empty</h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Looks like you haven't added any items to your wishlist yet. Browse our products and find something you love!
                </p>
                <Link to="/products">
                    <Button size="lg">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 font-heading">My Wishlist ({items.length})</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        image={product.image}
                        category={product.category}
                    />
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
