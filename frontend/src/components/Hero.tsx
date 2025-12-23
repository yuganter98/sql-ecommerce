import { motion, useScroll, useTransform } from 'framer-motion';
import Button from './ui/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

    return (
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    style={{ y }}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="w-full h-full"
                >
                    <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                        alt="Fashion Hero"
                        className="w-full h-full object-cover opacity-60"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-[0.2em] uppercase mb-8"
                    >
                        New Collection 2025
                    </motion.span>
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-[0.9] font-heading">
                        Redefine Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                            Signature Style
                        </span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light tracking-wide">
                        Discover a curated selection of premium essentials designed for the modern individual.
                        Quality, comfort, and elegance in every detail.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-base group relative overflow-hidden bg-primary text-white hover:bg-primary/90 border-none">
                            <span className="relative z-10 flex items-center font-medium">
                                Shop Now
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Button>
                        <Link to="/lookbook" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full px-8 py-4 text-base text-white border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm">
                                View Lookbook
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
