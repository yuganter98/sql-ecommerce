import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { items, removeItem, updateQuantity, total } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6"
                >
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything yet. Explore our collection to find your new favorites.</p>
                <Link to="/products">
                    <Button size="lg">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-10 font-heading">Shopping Cart</h1>

            <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.li
                                        key={item.product_id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center"
                                    >
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 flex flex-col w-full">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>
                                                        <Link to={`/products/${item.product_id}`} className="hover:text-primary transition-colors font-heading text-lg">
                                                            {item.name}
                                                        </Link>
                                                    </h3>
                                                    <p className="ml-4 font-bold">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">{item.category_name || item.categories?.name || 'Uncategorized'}</p>
                                            </div>
                                            <div className="flex-1 flex items-end justify-between text-sm mt-4">
                                                <div className="flex items-center border border-gray-200 rounded-full">
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                        className="p-2 hover:bg-gray-50 text-gray-600 rounded-l-full transition-colors"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="px-4 font-medium text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-50 text-gray-600 rounded-r-full transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.product_id)}
                                                    className="font-medium text-red-500 hover:text-red-600 flex items-center gap-2 transition-colors text-xs uppercase tracking-wide"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-gray-50 rounded-2xl p-8 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 font-heading">Order Summary</h2>
                        <div className="flow-root">
                            <dl className="-my-4 divide-y divide-gray-200">
                                <div className="py-4 flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Subtotal</dt>
                                    <dd className="text-sm font-medium text-gray-900">${total.toFixed(2)}</dd>
                                </div>
                                <div className="py-4 flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Shipping</dt>
                                    <dd className="text-sm font-medium text-gray-900">Free</dd>
                                </div>
                                <div className="py-4 flex items-center justify-between border-t border-gray-200 mt-4 pt-4">
                                    <dt className="text-lg font-bold text-gray-900">Order Total</dt>
                                    <dd className="text-lg font-bold text-primary">${total.toFixed(2)}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="mt-8">
                            <Link to="/checkout" className="block w-full">
                                <Button className="w-full shadow-lg" size="lg">
                                    Proceed to Checkout
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
