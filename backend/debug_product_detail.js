async function fetchProduct() {
    try {
        const response = await fetch('http://localhost:3000/api/products/203f4ec6-9134-492a-8850-344387b1d9ea');
        const data = await response.json();
        console.log('Product Details:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error fetching product:', error.message);
    }
}

fetchProduct();
