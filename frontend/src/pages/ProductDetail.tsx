import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Minus, Plus, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import FeaturedCarousel from '../components/FeaturedCarousel';
import client from '../api/client';
import { useCartStore } from '../store/cartStore';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

const ProductDetail = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('Black');
    const addItem = useCartStore((state) => state.addItem);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const { setBackgroundColor, resetBackground } = useThemeStore();
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    useEffect(() => {
        if (product) {
            setMainImage(product.image);

            const fetchRelatedProducts = async () => {
                try {
                    const response = await client.get('/products');
                    const allProducts = response.data;

                    // Filter by matching category_id and exclude current product
                    const related = allProducts
                        .filter((p: any) => p.category_id === product.category_id && p.product_id !== product.product_id)
                        .map((p: any) => ({
                            id: p.product_id,
                            title: p.name,
                            price: Number(p.price),
                            image: p.image_url || 'https://via.placeholder.com/300',
                            category: p.categories?.name || 'Uncategorized'
                        }))
                        .slice(0, 5);

                    // If not enough related products, maybe fill with others? For now strict filtering.
                    setRelatedProducts(related);
                } catch (error) {
                    console.error('Failed to fetch related products', error);
                }
            };

            fetchRelatedProducts();
        }
    }, [product]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await client.get(`/products/${id}`);
                const p = response.data;
                setProduct({
                    ...p,
                    id: p.product_id,
                    title: p.name,
                    price: Number(p.price),
                    image: p.image_url || 'https://via.placeholder.com/300',
                    category: p.categories?.name || 'Uncategorized',
                    description: p.description || 'No description available.',
                    rating: 4.5, // Default rating
                    reviews: 0, // Default reviews count
                    images: p.product_images && p.product_images.length > 0
                        ? [p.image_url, ...p.product_images.map((img: any) => img.image_url)]
                        : [p.image_url || 'https://via.placeholder.com/300'],
                    sizes: ['S', 'M', 'L', 'XL'],
                    colors: ['Black', 'White'],
                    stock_quantity: p.stock_quantity,
                    has_sizes: p.categories?.has_sizes ?? false
                });
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();

            // Track Recently Viewed
            const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            if (!viewed.includes(id)) {
                const newViewed = [id, ...viewed].slice(0, 5); // Keep last 5
                localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));
            }
        }
    }, [id]);

    useEffect(() => {
        return () => resetBackground(); // Reset on unmount
    }, [resetBackground]);

    // Map colors to Tailwind gradients
    const colorMap: { [key: string]: string } = {
        'Black': 'from-gray-900 via-gray-800 to-gray-900',
        'White': 'from-gray-100 via-white to-gray-200',
        'Red': 'from-red-100 via-white to-red-50',
        'Blue': 'from-blue-100 via-white to-blue-50',
        'Green': 'from-green-100 via-white to-green-50',
        'Yellow': 'from-yellow-100 via-white to-yellow-50',
        'Purple': 'from-purple-100 via-white to-purple-50',
        'Pink': 'from-pink-100 via-white to-pink-50',
        'Camel': 'from-orange-100 via-white to-orange-50',
    };

    useEffect(() => {
        if (product && product.colors && product.colors.length > 0) {
            // Use the first color or the selected color to set the theme
            const color = selectedColor || product.colors[0];
            const gradient = colorMap[color] || 'from-sky-100 via-white to-sky-50';
            setBackgroundColor(gradient);
        }
    }, [product, selectedColor, setBackgroundColor]);

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            product_id: product.id,
            name: product.title,
            price: Number(product.price),
            image_url: product.image,
            description: product.description,
            stock_quantity: 100,
            category_id: product.category_id,
            category_name: product.category, // Pass the category name explicitly
            created_at: new Date().toISOString()
        }, quantity);
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
    }

    if (!product) {
        return <div className="container mx-auto px-4 py-12 text-center">Product not found</div>;
    }



    return (
        <div className="min-h-screen bg-[#050511] text-white selection:bg-white/20 font-sans">
            {/* Elegant Background Gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 pt-28 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">

                    {/* LEFT: Immersive Product Visual */}
                    <div className="lg:col-span-7 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="sticky top-32 w-full aspect-square rounded-[3rem] overflow-hidden bg-white/5 border border-white/5 backdrop-blur-sm flex items-center justify-center p-8 lg:p-16 mb-8 lg:mb-0"
                        >
                            {/* Subtle internal glow matching selected color */}
                            <div
                                className="absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent via-transparent to-white/10 transition-colors duration-700"
                                style={{ background: selectedColor && colorMap[selectedColor] ? undefined : '' }}
                            />

                            <motion.img
                                key={mainImage}
                                src={mainImage}
                                alt={product.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            />

                            {/* Image Navigation */}
                            {product.images?.length > 1 && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    {product.images.map((img: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => setMainImage(img)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${mainImage === img ? 'bg-white scale-110' : 'bg-white/30 hover:bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* RIGHT: Product Story & Controls */}
                    <div className="lg:col-span-1" /> {/* Spacer */}
                    <div className="lg:col-span-4 flex flex-col justify-center space-y-8 py-4">

                        {/* Header Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="flex items-center gap-3 text-indigo-300 font-mono text-xs tracking-[0.2em] uppercase mb-4">
                                <span className="w-8 h-[1px] bg-indigo-500/50"></span>
                                <span>{product.category}</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                                {product.title}
                            </h1>
                            <div className="flex items-baseline gap-4">
                                <p className="text-3xl font-light text-indigo-100">
                                    ${product.price?.toFixed(2)}
                                </p>
                                <div className="flex items-center gap-1 text-sm text-white/50">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-white font-medium">{product.rating}</span>
                                    <span>•</span>
                                    <span className="underline decoration-white/20 underline-offset-4">{product.reviews} reviews</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/70 leading-relaxed text-lg font-light"
                        >
                            {product.description}
                        </motion.p>

                        <div className="w-full h-[1px] bg-white/10" />

                        {/* Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Color */}
                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Finish</h3>
                                <div className="flex gap-3">
                                    {product.colors?.map((color: string) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === color ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#050511]' : 'hover:ring-1 hover:ring-white/30'}`}
                                            title={color}
                                        >
                                            <div
                                                className="w-full h-full rounded-full border border-white/10"
                                                style={{ backgroundColor: color.toLowerCase() === 'camel' ? '#C19A6B' : color.toLowerCase() }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size */}
                            {product.has_sizes && (
                                <div>
                                    <div className="flex justify-between mb-3">
                                        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Size</h3>
                                        <button className="text-xs text-white/40 hover:text-white transition-colors underline decoration-dotted">Size Guide</button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {product.sizes?.map((size: string) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`py-3 text-sm font-medium border rounded-lg transition-all ${selectedSize === size
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-transparent text-white border-white/20 hover:border-white/50'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart Group */}
                            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center justify-between w-full sm:w-auto bg-white/5 border border-white/10 rounded-xl">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 sm:w-12 h-12 sm:h-14 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-mono text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 sm:w-12 h-12 sm:h-14 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={handleAddToCart}
                                    disabled={product.stock_quantity === 0}
                                    className="flex-1 h-14 text-base font-semibold tracking-wide bg-indigo-600 hover:bg-indigo-500 text-white border-none rounded-xl shadow-lg shadow-indigo-500/20"
                                >
                                    {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Bag'}
                                </Button>
                            </div>

                            {/* Trust Signals */}
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                                    <Truck className="w-5 h-5 text-indigo-400 mb-1" />
                                    <span className="text-[10px] uppercase tracking-wider text-white/60">Free Ship</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                                    <ShieldCheck className="w-5 h-5 text-indigo-400 mb-1" />
                                    <span className="text-[10px] uppercase tracking-wider text-white/60">2 Yr Warranty</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                                    <RefreshCw className="w-5 h-5 text-indigo-400 mb-1" />
                                    <span className="text-[10px] uppercase tracking-wider text-white/60">30 Day Returns</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="border-t border-white/10 mt-32 pt-16">
                    <FeaturedCarousel title="Pair With" products={relatedProducts} variant="dark" />
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
