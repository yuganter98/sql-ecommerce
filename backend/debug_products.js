async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        console.log('Product IDs:', data.map(p => p.product_id));
    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
}

fetchProducts();
