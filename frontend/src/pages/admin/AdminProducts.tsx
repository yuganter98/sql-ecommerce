import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Upload, Loader } from 'lucide-react';
import client from '../../api/client';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
    product_id: string;
    name: string;
    price: number;
    stock_quantity: number;
    category_id: string;
    image_url: string;
    description?: string;
    product_images?: { image_url: string }[];
}

interface Category {
    category_id: string;
    name: string;
}

const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: '',
        image_url: '',
        images: ['', '', '', ''] // Array for 4 additional images
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await client.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await client.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading products...</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Filter out empty image strings
            const imagesToSend = formData.images.filter(img => img.trim() !== '');
            const dataToSend = { ...formData, images: imagesToSend };

            if (editingId) {
                await client.put(`/admin/products/${editingId}`, dataToSend);
            } else {
                await client.post('/admin/products', dataToSend);
            }
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ name: '', description: '', price: '', stock_quantity: '', category_id: '', image_url: '', images: ['', '', '', ''] });
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.product_id);

        // Populate images array
        const currentImages = ['', '', '', ''];
        if (product.product_images) {
            product.product_images.forEach((img, index) => {
                if (index < 4) currentImages[index] = img.image_url;
            });
        }

        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock_quantity: product.stock_quantity.toString(),
            category_id: product.category_id || '',
            image_url: product.image_url || '',
            images: currentImages
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await client.delete(`/admin/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', price: '', stock_quantity: '', category_id: '', image_url: '', images: ['', '', '', ''] });
        setIsModalOpen(true);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        try {
            const res = await client.post('/upload', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (index !== undefined) {
                // Updating additional images
                const newImages = [...formData.images];
                newImages[index] = res.data.url;
                setFormData({ ...formData, images: newImages });
            } else {
                // Updating main image
                setFormData({ ...formData, image_url: res.data.url });
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 font-heading">Products</h1>
                <Button onClick={openAddModal}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.product_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-lg object-cover" src={product.image_url} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">${Number(product.price).toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${product.stock_quantity === 0 ? 'bg-red-100 text-red-800' :
                                                product.stock_quantity < 5 ? 'bg-orange-100 text-orange-800' :
                                                    'bg-green-100 text-green-800'}`}>
                                            {product.stock_quantity === 0 ? 'Out of Stock' :
                                                product.stock_quantity < 5 ? `Stock Up (${product.stock_quantity})` :
                                                    product.stock_quantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(product.product_id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
                        >
                            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <button
                                            type="button"
                                            disabled={isGenerating}
                                            onClick={async () => {
                                                if (!formData.name || !formData.category_id) {
                                                    alert('Please enter a name and select a category first.');
                                                    return;
                                                }
                                                // Find category name
                                                const cat = categories.find(c => c.category_id === formData.category_id);
                                                if (!cat) {
                                                    alert('Invalid category selected.');
                                                    return;
                                                }

                                                setIsGenerating(true);
                                                try {
                                                    const res = await client.post('/chat/generate-description', {
                                                        name: formData.name,
                                                        category: cat.name
                                                    });
                                                    setFormData({ ...formData, description: res.data.description });
                                                } catch (err) {
                                                    console.error(err);
                                                    alert('Failed to generate description. Check console for details.');
                                                } finally {
                                                    setIsGenerating(false);
                                                }
                                            }}
                                            className="text-xs text-primary hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <span className="animate-spin">✨</span> Generating...
                                                </>
                                            ) : (
                                                <>✨ Generate with AI</>
                                            )}
                                        </button>
                                    </div>
                                    <textarea
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Price</label>
                                        <input
                                            type="number"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                                        <input
                                            type="number"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                            value={formData.stock_quantity}
                                            onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.category_id} value={category.category_id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Main Image URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        />
                                        <label className="mt-1 cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                            {isUploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e)} />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images (Optional)</label>
                                    <div className="space-y-2">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="url"
                                                    placeholder={`Image URL ${index + 1}`}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                    value={img}
                                                    onChange={(e) => {
                                                        const newImages = [...formData.images];
                                                        newImages[index] = e.target.value;
                                                        setFormData({ ...formData, images: newImages });
                                                    }}
                                                />
                                                <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                                    {isUploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, index)} />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingId ? 'Save Changes' : 'Add Product'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProducts;
