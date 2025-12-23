import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, TrendingUp, ArrowUpRight } from 'lucide-react';
import Button from '../components/ui/Button';
import client from '../api/client';
import { Link } from 'react-router-dom';
import HeroScene from '../components/3d/HeroScene';

const Home = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);

    // Bento Grid Images
    const categoryImages: { [key: string]: string } = {
        'Electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop',
        'Clothing': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
        'Home & Garden': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2074&auto=format&fit=crop',
        'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop',
        'Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
        'Accessories': 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2070&auto=format&fit=crop',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    client.get('/products'),
                    client.get('/categories')
                ]);

                const productData = productsRes.data.map((p: any) => ({
                    ...p,
                    id: p.product_id,
                    title: p.name,
                    price: Number(p.price),
                    image: p.image_url || 'https://via.placeholder.com/300',
                    category: p.categories?.name || 'Uncategorized'
                }));
                setProducts(productData);

                const uniqueCategoriesMap = new Map();
                categoriesRes.data.forEach((cat: any) => {
                    if (!uniqueCategoriesMap.has(cat.name)) {
                        uniqueCategoriesMap.set(cat.name, {
                            name: cat.name,
                            // Use image from API (from product) -> fallback to hardcoded map -> fallback to placeholder
                            image: cat.image || categoryImages[cat.name] || 'https://via.placeholder.com/400?text=No+Image',
                            count: cat._count?.products || 0
                        });
                    }
                });
                setCategories(Array.from(uniqueCategoriesMap.values()));

            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const featuredProducts = products.slice(0, 4);

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>;
    }

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const glassCard = "bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300";

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)] pb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* 1. Hero Section (Large, spans 8 cols, 2 rows) */}
            <motion.div variants={itemVariants} className={`md:col-span-8 md:row-span-2 ${glassCard} relative flex flex-col justify-center p-10 group min-h-[400px]`}>
                <div className="absolute inset-0 z-0">
                    <HeroScene />
                </div>
                <div className="relative z-10 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider mb-4 text-white">
                        <SparklesIcon className="w-3 h-3 text-indigo-400" /> New Collection
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
                        Redefine <br /> Your Style.
                    </h1>
                    <p className="text-lg text-gray-200 mb-8 max-w-md font-medium drop-shadow-md">
                        Discover the latest trends in fashion and accessories. Curated just for you.
                    </p>
                    <Link to="/products">
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full px-8 shadow-xl bg-white !text-gray-900 hover:!bg-gray-200 hover:!text-gray-900 border-none transition-colors"
                        >
                            Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* 2. AI Shopper Promo (Spans 4 cols, 1 row) */}
            <motion.div variants={itemVariants} className={`md:col-span-4 md:row-span-1 ${glassCard} bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 flex items-center justify-between relative overflow-hidden`}>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">AI Shopper</h3>
                    <p className="text-sm text-gray-600 mb-4">Your personal stylist.</p>
                    <Link to="/personal-shopper">
                        <button className="px-4 py-2 bg-white rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                            Try Now <SparklesIcon className="w-3 h-3 text-indigo-500" />
                        </button>
                    </Link>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-20 rotate-12">
                    <SparklesIcon className="w-32 h-32" />
                </div>
            </motion.div>

            {/* 3. Trending Product (Moved to Sidebar, Spans 4 cols, 1 row) */}
            {featuredProducts[0] && (
                <motion.div variants={itemVariants} className={`md:col-span-4 md:row-span-1 ${glassCard} relative overflow-hidden group`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100/50" />
                    <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                                    <TrendingUp className="w-3 h-3" /> Trending Hot
                                </span>
                                <h4 className="font-bold text-xl text-gray-900 mt-3 max-w-[150px] leading-tight break-words">{featuredProducts[0].title}</h4>
                                <p className="font-semibold text-gray-600 mt-1">${featuredProducts[0].price}</p>
                            </div>
                            <Link to={`/products/${featuredProducts[0].id}`} className="p-2 bg-white text-black rounded-full hover:bg-black hover:text-white transition-colors shadow-sm">
                                <ArrowUpRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <div className="flex justify-center mt-4">
                            <div className="w-48 h-48 relative">
                                <div className="absolute inset-0 bg-orange-200 rounded-full blur-2xl opacity-40 mix-blend-multiply animate-blob" />
                                <img
                                    src={featuredProducts[0].image}
                                    alt={featuredProducts[0].title}
                                    className="relative w-full h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}


            {/* 4. Categories (FULL WIDTH - 12 Cols) */}
            <motion.div variants={itemVariants} className="md:col-span-12 mt-8 mb-8">
                <div className="flex justify-between items-end mb-6 px-2">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">Shop by Category</h3>
                        <p className="text-gray-500 mt-1">Explore our wide range of collections</p>
                    </div>
                    <Link to="/products" className="text-sm font-medium text-gray-900 hover:text-primary underline decoration-gray-300 underline-offset-4">View All Categories</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat, idx) => (
                        <Link
                            key={cat.name}
                            to={`/products?category=${cat.name}`}
                            className={`group relative h-80 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 ${idx === 0 || idx === 3 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            {/* Text Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-8">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <h4 className="text-3xl font-bold text-white mb-2 tracking-tight">{cat.name}</h4>
                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 delay-100">
                                        <span className="text-sm text-gray-200 font-medium tracking-wide uppercase">{cat.count} collections</span>
                                        <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                                            <ArrowRight className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* 5. New Arrivals (Horizontal Scroll Spotlight) */}
            <motion.div variants={itemVariants} className="md:col-span-12 mt-8 mb-12">
                <div className="flex justify-between items-end mb-8 px-4">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-400 font-medium mb-2">
                            <SparklesIcon className="w-4 h-4" />
                            <span className="uppercase tracking-widest text-xs">Fresh Drops</span>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-900 tracking-tight">New Arrivals</h3>
                    </div>

                    <div className="flex gap-2">
                        <Link to="/products?sort=newest">
                            <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:bg-gray-50">
                                View Collection <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-12 px-4 snap-x snap-mandatory scrollbar-hide -mx-4 md:-mx-0">
                    {featuredProducts.map((product) => (
                        <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            className="min-w-[280px] md:min-w-[340px] snap-center group relative block"
                        >
                            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 relative mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Quick Add Button */}
                                <div className="absolute bottom-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="bg-white text-black p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1 px-1">
                                <h4 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">{product.title}</h4>
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-gray-500">{product.category}</p>
                                    <p className="font-bold text-gray-900 text-lg">${product.price}</p>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* "See More" Card */}
                    <Link to="/products" className="min-w-[200px] snap-center flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors group">
                        <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-indigo-50 flex items-center justify-center mb-4 transition-colors">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                        <span className="font-bold">View All</span>
                    </Link>
                </div>
            </motion.div>

            {/* 6. Newsletter (Spans 4 cols) */}
            {/* 6. Newsletter (Full Width Holographic) */}
            <motion.div variants={itemVariants} className="md:col-span-12 relative overflow-hidden rounded-[2.5rem] mt-4 mb-8 group">
                <div className="absolute inset-0 bg-[#050511]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                {/* Animated Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s' }} />

                <div className="relative z-10 grid md:grid-cols-2 gap-12 p-12 md:p-16 items-center">
                    <div className="text-left space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                            <SparklesIcon className="w-3 h-3" /> VIP Access
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                            Unlock the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Future of Fashion.</span>
                        </h3>
                        <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                            Join 50,000+ tastemakers. Get early access to drops, exclusive styling tips, and 15% off your first order.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <NewsletterForm />
                        <p className="mt-4 text-xs text-gray-500 text-center">
                            By subscribing you agree to our Terms & Conditions. No spam, ever.
                        </p>
                    </div>
                </div>
            </motion.div>

        </motion.div>
    );
};

// Helper Icon
const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" />
    </svg>
);

// Helper Component for Newsletter to keep main component clean
const NewsletterForm = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubscribe = async () => {
        if (!email) return;
        setStatus('loading');

        // Simulating API call for now since backend functionality is disabled
        setTimeout(() => {
            console.log('Newsletter subscription requested for:', email);
            setStatus('success');
            setEmail('');
        }, 1000);
    };

    return (
        <div className="space-y-3">
            {status === 'success' ? (
                <div className="bg-green-500/20 text-green-200 p-3 rounded-lg text-sm border border-green-500/50">
                    Welcome to the club! (Simulated)
                </div>
            ) : (
                <>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm transition-all"
                        disabled={status === 'loading'}
                    />
                    <button
                        onClick={handleSubscribe}
                        disabled={status === 'loading'}
                        className="w-full py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
                    </button>
                </>
            )}
        </div>
    );
};

export default Home;
