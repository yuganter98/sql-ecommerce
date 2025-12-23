import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import client from '../api/client';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchFilter = searchParams.get('search');
    const categoryFilter = searchParams.get('category');
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('featured');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    client.get('/products'),
                    client.get('/categories')
                ]);

                const uniqueCategories = Array.from(
                    new Map(categoriesRes.data.map((item: any) => [item.name, item])).values()
                );
                setCategories(uniqueCategories);

                let data = productsRes.data.map((p: any) => ({
                    ...p,
                    id: p.product_id,
                    title: p.name,
                    price: Number(p.price),
                    image: p.image_url || 'https://via.placeholder.com/300',
                    category: p.categories?.name || 'Uncategorized'
                }));

                if (searchFilter) {
                    data = data.filter((p: any) =>
                        p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        p.description?.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchFilter.toLowerCase())
                    );
                } else if (categoryFilter) {
                    data = data.filter((p: any) =>
                        p.category.toLowerCase() === categoryFilter.toLowerCase()
                    );
                }

                // Sort logic
                if (sortBy === 'price-low') {
                    data.sort((a: any, b: any) => a.price - b.price);
                } else if (sortBy === 'price-high') {
                    data.sort((a: any, b: any) => b.price - a.price);
                } else if (sortBy === 'newest') {
                    data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                }

                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryFilter, searchFilter, sortBy]);

    if (loading) {
        return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {searchFilter
                            ? `Search Results for "${searchFilter}"`
                            : categoryFilter
                                ? `${categoryFilter} Collection`
                                : 'All Products'}
                    </h1>
                    <p className="text-gray-500 mt-1">Showing {products.length} results</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Button
                            variant={categoryFilter ? 'primary' : 'outline'}
                            size="sm"
                            icon={<Filter className="w-4 h-4" />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            {categoryFilter || 'Filters'}
                        </Button>

                        {showFilters && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowFilters(false)}
                                />
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 max-h-64 overflow-y-auto">
                                    <button
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!categoryFilter ? 'font-medium text-black' : 'text-gray-600'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSearchParams(prev => {
                                                const newParams = new URLSearchParams(prev);
                                                newParams.delete('category');
                                                return newParams;
                                            });
                                            setShowFilters(false);
                                        }}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.category_id}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${categoryFilter === cat.name ? 'font-medium text-black' : 'text-gray-600'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSearchParams(prev => {
                                                    const newParams = new URLSearchParams(prev);
                                                    newParams.set('category', cat.name);
                                                    return newParams;
                                                });
                                                setShowFilters(false);
                                            }}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-black text-sm cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="featured">Featured</option>
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>

            {/* Pagination (Mock) */}
            <div className="mt-16 flex justify-center">
                <div className="flex gap-2">
                    <Button variant="outline" disabled>Previous</Button>
                    <Button variant="primary">1</Button>
                    <Button variant="outline">2</Button>
                    <Button variant="outline">3</Button>
                    <Button variant="outline">Next</Button>
                </div>
            </div>
        </div>
    );
};

export default Products;
