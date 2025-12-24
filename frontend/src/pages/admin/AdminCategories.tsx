import { useEffect, useState } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import client from '../../api/client';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
    category_id: string;
    name: string;
    description?: string;
    image: string | null;
    _count?: {
        products: number;
    };
}

const AdminCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await client.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await client.post('/categories', formData);
            setIsModalOpen(false);
            setFormData({ name: '', description: '' });
            fetchCategories();
        } catch (err: any) {
            console.error('Error creating category:', err);
            setError(err.response?.data?.error || 'Failed to create category');
        }
    };

    const handleDeleteClick = (id: string, productCountType: any = 0) => {
        const count = Number(productCountType);
        if (count > 0) {
            alert(`Cannot delete this category because it contains ${count} products. Please move or delete the products first.`);
            return;
        }
        setCategoryToDelete(id);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;

        try {
            await client.delete(`/categories/${categoryToDelete}`);
            setCategoryToDelete(null);
            fetchCategories();
        } catch (err: any) {
            console.error('Error deleting category:', err);
            alert(err.response?.data?.error || 'Failed to delete category');
            setCategoryToDelete(null);
        }
    };

    if (isLoading && categories.length === 0) {
        return <div className="p-8 text-center">Loading categories...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 font-heading">Categories</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.category_id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="h-32 bg-gray-100 relative">
                            {category.image ? (
                                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                    No Image (Add products to auto-set)
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                                    {category._count?.products || 0} Products
                                </span>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{category.description || 'No description'}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                                <button
                                    onClick={() => handleDeleteClick(category.category_id, category._count?.products)}
                                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete Category"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Category Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                        >
                            <h2 className="text-xl font-bold mb-4">Add New Category</h2>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Summer Collection"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Optional description..."
                                        rows={3}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Create Category
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {categoryToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center"
                        >
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Category?</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to delete this category? This action cannot be undone.
                            </p>
                            <div className="flex justify-center gap-3">
                                <Button variant="secondary" onClick={() => setCategoryToDelete(null)}>
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCategories;
