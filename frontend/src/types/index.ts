export interface Category {
    category_id: string;
    name: string;
    description?: string;
}

export interface Product {
    product_id: string;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category_id?: string;
    categories?: Category;
    image_url?: string;
    created_at: string;
}

export interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
}
