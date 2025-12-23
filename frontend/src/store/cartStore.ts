import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            addItem: (product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find((item) => item.product_id === product.product_id);

                if (existingItem) {
                    const updatedItems = items.map((item) =>
                        item.product_id === product.product_id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                    set({
                        items: updatedItems,
                        total: calculateTotal(updatedItems),
                    });
                } else {
                    const updatedItems = [...items, { ...product, quantity }];
                    set({
                        items: updatedItems,
                        total: calculateTotal(updatedItems),
                    });
                }
            },
            removeItem: (productId) => {
                const updatedItems = get().items.filter((item) => item.product_id !== productId);
                set({
                    items: updatedItems,
                    total: calculateTotal(updatedItems),
                });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                const updatedItems = get().items.map((item) =>
                    item.product_id === productId ? { ...item, quantity } : item
                );
                set({
                    items: updatedItems,
                    total: calculateTotal(updatedItems),
                });
            },
            clearCart: () => {
                set({ items: [], total: 0 });
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);

const calculateTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};
