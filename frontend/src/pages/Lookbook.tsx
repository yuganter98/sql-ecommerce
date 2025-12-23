import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const lookbookItems = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
        title: 'Urban Explorer',
        description: 'City chic for the modern wanderer.',
        size: 'large'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop',
        title: 'Summer Breeze',
        description: 'Light fabrics for warm days.',
        size: 'small'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1529139574466-a302d20525a4?q=80&w=1887&auto=format&fit=crop',
        title: 'Evening Elegance',
        description: 'Sophisticated styles for the night.',
        size: 'tall'
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop',
        title: 'Casual Friday',
        description: 'Relaxed fits for the weekend.',
        size: 'small'
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1888&auto=format&fit=crop',
        title: 'Statement Pieces',
        description: 'Bold designs that stand out.',
        size: 'tall'
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1887&auto=format&fit=crop',
        title: 'Minimalist',
        description: 'Less is more.',
        size: 'large'
    }
];

const Lookbook = () => {
    return (
        <div className="pt-20 min-h-screen bg-white">
            {/* Header */}
            <div className="relative h-[40vh] bg-gray-900 flex items-center justify-center overflow-hidden mb-12">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                        alt="Lookbook Header"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold font-heading mb-4"
                    >
                        The Lookbook
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-light tracking-wide"
                    >
                        Spring / Summer 2025 Collection
                    </motion.p>
                </div>
            </div>

            {/* Gallery */}
            <div className="container mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                    {lookbookItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative group overflow-hidden rounded-2xl ${item.size === 'large' ? 'md:col-span-2 lg:col-span-2' : ''
                                } ${item.size === 'tall' ? 'row-span-2' : ''}`}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-200 mb-4">{item.description}</p>
                                <Link to="/products" className="inline-flex items-center text-white font-medium hover:underline">
                                    Shop the Look <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Lookbook;
