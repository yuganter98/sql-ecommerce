import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';

const Footer = () => {
    return (
        <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold tracking-tighter">LUXE.</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Elevating your lifestyle with premium essentials. Designed for the modern minimalist.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Youtube size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-black transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Best Sellers</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Accessories</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Sale</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="hover:text-black transition-colors">FAQs</Link></li>
                            <li><Link to="/shipping" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Stay in the loop</h4>
                        <p className="text-gray-500 text-sm mb-4">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none text-sm"
                            />
                            <Button className="w-full">Subscribe</Button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>&copy; 2025 LUXE Inc. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-black transition-colors">Terms</a>
                        <Link to="/privacy" className="hover:text-black transition-colors">Privacy</Link>
                        <a href="#" className="hover:text-black transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
