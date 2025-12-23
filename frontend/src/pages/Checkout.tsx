import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import client from '../api/client';
import { useAuthStore } from '../store/authStore';

const Checkout = () => {
    const { items, total, clearCart } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [shippingAddress, setShippingAddress] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    // Address Book State
    const [userAddresses, setUserAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('new');

    // Auth Check
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/checkout');
        } else if (items.length === 0) {
            navigate('/cart');
        }
    }, [isAuthenticated, items, navigate]);

    // Fetch Addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await client.get('/addresses');
                if (res.data.length > 0) {
                    setUserAddresses(res.data);
                    const defaultAddr = res.data.find((a: any) => a.is_default) || res.data[0];
                    setSelectedAddressId(defaultAddr.address_id);
                    setShippingAddress(`${defaultAddr.address_line}, ${defaultAddr.city}, ${defaultAddr.country}`);
                }
            } catch (err) {
                console.error(err);
            }
        };
        if (isAuthenticated) {
            fetchAddresses();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated || items.length === 0) {
        return null;
    }

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleAddressChange = (id: string) => {
        setSelectedAddressId(id);
        if (id === 'new') {
            setShippingAddress('');
        } else {
            const addr = userAddresses.find(a => a.address_id === id);
            if (addr) {
                setShippingAddress(`${addr.address_line}, ${addr.city}, ${addr.country}`);
            }
        }
    };

    const handleCheckout = async () => {
        if (!shippingAddress) {
            setError('Please enter a shipping address');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setStatusMessage('Processing Order...');

        try {
            if (paymentMethod === 'CARD') {
                const res = await loadRazorpay();

                if (!res) {
                    setError('Razorpay SDK failed to load. Are you online?');
                    setIsProcessing(false);
                    return;
                }

                // Create order on backend
                const result = await client.post('/payment/create-order', {
                    amount: total,
                });

                const { id: order_id, currency } = result.data;

                const options = {
                    key: 'rzp_test_placeholder', // Enter the Key ID generated from the Dashboard
                    amount: result.data.amount,
                    currency: currency,
                    name: "E-Commerce Store",
                    description: "Test Transaction",
                    order_id: order_id,
                    handler: async function (response: any) {
                        try {
                            const verifyRes = await client.post('/payment/verify-payment', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                order_details: {
                                    items: items.map(item => ({
                                        product_id: item.product_id,
                                        quantity: item.quantity
                                    })),
                                    shipping_address: shippingAddress
                                }
                            });

                            if (verifyRes.data.status === 'success') {
                                clearCart();
                                navigate('/dashboard');
                            }
                        } catch (err) {
                            console.error('Payment verification failed', err);
                            setError('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: user?.name,
                        email: user?.email,
                        contact: user?.phone_number
                    },
                    theme: {
                        color: "#000000"
                    }
                };

                const paymentObject = new (window as any).Razorpay(options);
                paymentObject.open();
                setIsProcessing(false); // Modal opened, stop spinner
            } else if (paymentMethod === 'GPAY') {
                // SIMULATED GOOGLE PAY FLOW
                setStatusMessage('Connecting to Google Pay...');
                await new Promise(resolve => setTimeout(resolve, 1000));

                setStatusMessage('Authorizing Payment...');
                await new Promise(resolve => setTimeout(resolve, 1500));

                setStatusMessage('Payment Successful!');
                await new Promise(resolve => setTimeout(resolve, 500));

                const orderData = {
                    items: items.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity
                    })),
                    shipping_address: shippingAddress,
                    payment_method: 'GPAY'
                };

                await client.post('/orders', orderData);
                clearCart();
                navigate('/dashboard');

            } else {
                // COD Flow
                const orderData = {
                    items: items.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity
                    })),
                    shipping_address: shippingAddress,
                    payment_method: paymentMethod
                };

                await client.post('/orders', orderData);
                clearCart();
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Checkout failed', err);
            console.error('Error response:', err.response?.data);
            (window as any).checkoutError = err.response?.data || err.message;
            setError(err.response?.data?.message || 'Checkout failed. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="p-8">
                    <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                    <div className="mb-8 space-y-4">
                        {userAddresses.length > 0 && (
                            <div className="space-y-3">
                                {userAddresses.map((addr) => (
                                    <div key={addr.address_id} className={`flex items-center p-3 border rounded-lg cursor-pointer ${selectedAddressId === addr.address_id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`} onClick={() => handleAddressChange(addr.address_id)}>
                                        <input
                                            type="radio"
                                            name="address"
                                            checked={selectedAddressId === addr.address_id}
                                            onChange={() => handleAddressChange(addr.address_id)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                        />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{addr.address_line}</p>
                                            <p className="text-sm text-gray-500">{addr.city}, {addr.country}</p>
                                        </div>
                                        {addr.is_default && <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Default</span>}
                                    </div>
                                ))}

                                <div className={`flex items-center p-3 border rounded-lg cursor-pointer ${selectedAddressId === 'new' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`} onClick={() => handleAddressChange('new')}>
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={selectedAddressId === 'new'}
                                        onChange={() => handleAddressChange('new')}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-700">Use a new address</span>
                                </div>
                            </div>
                        )}

                        {(selectedAddressId === 'new' || userAddresses.length === 0) && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {userAddresses.length > 0 ? 'Enter New Address' : 'Shipping Address'}
                                </label>
                                <textarea
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your full shipping address"
                                    required
                                />
                            </div>
                        )}

                        <p className="text-sm text-gray-500 mt-2">
                            Please verify your address before placing the order.
                        </p>
                    </div>

                    <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center">
                            <input
                                id="cod"
                                name="paymentMethod"
                                type="radio"
                                value="COD"
                                checked={paymentMethod === 'COD'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                                Cash on Delivery (COD)
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="card"
                                name="paymentMethod"
                                type="radio"
                                value="CARD"
                                checked={paymentMethod === 'CARD'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                                Credit/Debit Card
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="gpay"
                                name="paymentMethod"
                                type="radio"
                                value="GPAY"
                                checked={paymentMethod === 'GPAY'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <label htmlFor="gpay" className="ml-3 block text-sm font-medium text-gray-700">
                                Google Pay (Test Mode)
                            </label>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                    <ul className="divide-y divide-gray-200 mb-8">
                        {items.map((item) => (
                            <li key={item.product_id} className="py-4 flex justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t border-gray-200 pt-6 mb-8">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total</span>
                            <span className="text-indigo-600">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${paymentMethod === 'GPAY'
                            ? 'bg-black hover:bg-gray-800' // Google Pay Style
                            : 'bg-indigo-600 hover:bg-indigo-700' // Standard Style
                            }`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {statusMessage}
                            </span>
                        ) : (
                            paymentMethod === 'GPAY' ? (
                                <span className="flex items-center gap-2">
                                    <span>Pay with </span>
                                    <span className="font-bold">G</span>
                                    <span>Pay</span>
                                </span>
                            ) : (
                                `Place Order (${paymentMethod})`
                            )
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
