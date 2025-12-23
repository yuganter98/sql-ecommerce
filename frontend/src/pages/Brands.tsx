import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const brands = [
    {
        name: 'Sony',
        description: 'Industry-leading audio and electronics.',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=500',
        color: 'bg-black text-white'
    },
    {
        name: 'Apple',
        description: 'Innovation in every detail.',
        image: 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&q=80&w=500',
        color: 'bg-gray-100 text-gray-900'
    },
    {
        name: 'Samsung',
        description: 'Shaping the future with transformative ideas.',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=500',
        color: 'bg-blue-600 text-white'
    },
    {
        name: 'Nike',
        description: 'Just Do It. Premium athletic wear.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500',
        color: 'bg-orange-500 text-white'
    },
    {
        name: 'Adidas',
        description: 'Impossible is Nothing.',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=500',
        color: 'bg-black text-white'
    },
    {
        name: 'Ray-Ban',
        description: 'Genuine since 1937.',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=500',
        color: 'bg-red-600 text-white'
    }
];

const Brands = () => {
    return (
        <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">Our Premium Brands</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover the world's most coveted brands, curated just for you. From high-tech electronics to premium fashion.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {brands.map((brand, index) => (
                        <motion.div
                            key={brand.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        >
                            <div className="absolute inset-0">
                                <img
                                    src={brand.image}
                                    alt={brand.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-3xl font-bold text-white mb-2">{brand.name}</h3>
                                <p className="text-white/80 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    {brand.description}
                                </p>
                                <Link
                                    to={`/products?search=${brand.name}`}
                                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 duration-300 delay-150"
                                >
                                    Shop Brand <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 p-12 bg-white rounded-3xl text-center shadow-sm border border-gray-100"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Partner with Us</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Are you a premium brand looking to reach discerning customers? Join our curated marketplace today.
                    </p>
                    <button className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors">
                        Become a Partner
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Brands;
