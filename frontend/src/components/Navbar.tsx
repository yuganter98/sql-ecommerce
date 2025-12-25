import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import client from '../api/client';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/products' },
        { name: 'New Arrivals', path: '/products?sort=newest' },
        { name: 'Brands', path: '/brands' },
    ];

    return (
        <header
            className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-full border border-white/40 bg-white/60 backdrop-blur-md shadow-lg transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-3 text-2xl font-bold tracking-tighter font-heading text-primary">
                        <img src="/logo.svg" alt="Luxe Logo" className="w-10 h-10 object-contain" />
                        <span className="hidden xl:inline">LUXE<span className="text-gray-400">.</span></span>
                        <span className="xl:hidden">L<span className="text-gray-400">.</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="relative group text-sm font-medium transition-colors hover:text-primary text-gray-600 whitespace-nowrap"
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ease-out ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                            </Link>
                        ))}
                        <Link to="/personal-shopper" className="relative group text-sm font-medium transition-colors hover:text-primary text-gray-600 flex items-center gap-1 whitespace-nowrap">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="hidden lg:inline">AI Shopper</span>
                            <span className="lg:hidden">AI</span>
                        </Link>
                    </nav>

                    {/* Icons & Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (e.target.value.length > 2) {
                                        client.get(`/search?q=${encodeURIComponent(e.target.value)}`)
                                            .then(res => setSearchResults(res.data))
                                            .catch(err => console.error(err));
                                    } else {
                                        setSearchResults([]);
                                    }
                                }}
                                onKeyDown={handleSearch}
                                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-gray-200 text-sm w-48 transition-all focus:w-64"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {searchResults.length > 0 && searchTerm.length > 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-96 overflow-y-auto"
                                    >
                                        {searchResults.map((product: any) => (
                                            <Link
                                                key={product.product_id}
                                                to={`/products/${product.product_id}`}
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setSearchResults([]);
                                                }}
                                            >
                                                <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-gray-500">${Number(product.price).toFixed(2)}</p>
                                                </div>
                                            </Link>
                                        ))}
                                        <Link
                                            to={`/products?search=${encodeURIComponent(searchTerm)}`}
                                            className="block p-3 text-center text-sm text-primary font-medium hover:bg-gray-50 border-t border-gray-100"
                                            onClick={() => setSearchResults([])}
                                        >
                                            View all results
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Heart className="w-5 h-5 text-gray-700" />
                        </Link>

                        <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ShoppingCart className="w-5 h-5 text-gray-700" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors" title={user?.name}>
                                    <User className="w-5 h-5 text-gray-700" />
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700 hover:text-red-600"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button variant="primary" size="sm">Login</Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Cart Icon & Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <Link to="/cart" className="relative p-2 rounded-full transition-colors text-gray-700">
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            className="p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-base font-medium text-gray-700"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link to="/personal-shopper" className="text-base font-medium text-gray-700 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                <Sparkles className="w-4 h-4 text-primary" /> AI Shopper
                            </Link>
                            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
                                {isAuthenticated ? (
                                    <>
                                        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full" variant="secondary">My Account</Button>
                                        </Link>
                                        <Button className="w-full text-red-600 border-red-200 hover:bg-red-50" variant="outline" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full">Login</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
