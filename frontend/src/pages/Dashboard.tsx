import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import { User, MapPin, Phone, Mail, Save, Loader2 } from 'lucide-react';
import client from '../api/client';
import axios from 'axios';

const Dashboard = () => {
    const { user, updateUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
        city: '',
        country: ''
    });

    useEffect(() => {
        if (user) {
            const [first, ...last] = user.name.split(' ');
            setFormData({
                first_name: first || '',
                last_name: last.join(' ') || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await client.put('/users/profile', formData);

            updateUser(response.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            console.error('Error updating profile:', error);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
            setMessage({ type: 'error', text: `Failed: ${errorMsg}` });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Account</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / User Info Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <User className="w-10 h-10 text-gray-400" />
                                </div>
                                <h2 className="text-xl font-bold">{user.name}</h2>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                {user.phone_number && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm">{user.phone_number}</span>
                                    </div>
                                )}
                                {user.address && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{user.address}, {user.city}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold mb-6">Edit Profile</h2>

                            {message && (
                                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* Address Book Section */}
                    <div className="md:col-span-3 mt-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold mb-6">Address Book</h2>
                            <AddressList />
                        </div>
                    </div>

                    {/* My Orders Section */}
                    <div className="md:col-span-3 mt-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold mb-6">My Orders</h2>
                            <OrdersList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AddressList = () => {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState({ address_line: '', city: '', country: '', is_default: false });

    const fetchAddresses = async () => {
        try {
            const res = await client.get('/addresses');
            setAddresses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await client.post('/addresses', newAddress);
            setIsAdding(false);
            setNewAddress({ address_line: '', city: '', country: '', is_default: false });
            fetchAddresses();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await client.delete(`/addresses/${id}`);
            fetchAddresses();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {addresses.map(addr => (
                    <div key={addr.address_id} className="border p-4 rounded-lg relative hover:shadow-md transition-shadow">
                        {addr.is_default && <span className="absolute top-2 right-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Default</span>}
                        <p className="font-medium">{addr.address_line}</p>
                        <p className="text-sm text-gray-500">{addr.city}, {addr.country}</p>
                        <button onClick={() => handleDelete(addr.address_id)} className="text-red-500 text-xs mt-2 hover:underline">Delete</button>
                    </div>
                ))}

                <button
                    onClick={() => setIsAdding(true)}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors h-full min-h-[100px]"
                >
                    <span className="text-2xl mb-1">+</span>
                    <span className="text-sm font-medium">Add New Address</span>
                </button>
            </div>

            {isAdding && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Add New Address</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input
                                placeholder="Address Line"
                                className="w-full border p-2 rounded"
                                value={newAddress.address_line}
                                onChange={e => setNewAddress({ ...newAddress, address_line: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="City"
                                    className="w-full border p-2 rounded"
                                    value={newAddress.city}
                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Country"
                                    className="w-full border p-2 rounded"
                                    value={newAddress.country}
                                    onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                                    required
                                />
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={newAddress.is_default}
                                    onChange={e => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                                />
                                Set as default address
                            </label>
                            <div className="flex gap-2 justify-end pt-4">
                                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <Button type="submit">Save Address</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const OrdersList = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useAuthStore((state) => state.user);
    // Token is now in cookie, not state

    useEffect(() => {
        const fetchOrders = async () => {
            // No token usage needed here as we rely on isAuthenticated state
            // If we need token for something specific, we shouldn't be reading it from state anyway
            const isAuthenticated = useAuthStore.getState().isAuthenticated;
            if (!isAuthenticated) {
                setLoading(false); // Ensure loading state is cleared if not authenticated
                return;
            }

            try {
                const response = await client.get('/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) { // Trigger fetch when user object is available (implies authenticated)
            fetchOrders();
        } else {
            setLoading(false); // If no user, not authenticated, stop loading
        }
    }, [user]); // Depend on user object

    if (loading) return <div>Loading orders...</div>;

    if (orders.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                You haven't placed any orders yet.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order.order_id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-medium text-gray-900">#{order.order_id.slice(0, 8)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium text-gray-900">
                                {new Date(order.order_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-medium text-gray-900">${Number(order.total_amount).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.payment_method === 'COD'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-green-100 text-green-800'
                                }`}>
                                {order.payment_method === 'COD' ? 'Amount Pending' : 'Paid'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                    <div className="p-6">
                        <ul className="divide-y divide-gray-100">
                            {order.order_items?.map((item: any) => (
                                <li key={item.order_item_id} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                            {item.products?.image_url ? (
                                                <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.products?.name || 'Unknown Product'}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-gray-900">${Number(item.unit_price).toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Dashboard;
