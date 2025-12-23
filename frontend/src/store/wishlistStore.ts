import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    category?: string;
}

interface WishlistState {
    items: Product[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const { items } = get();
                if (!items.find((i) => i.id === product.id)) {
                    set({ items: [...items, product] });
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((i) => i.id !== productId) });
            },
            isInWishlist: (productId) => {
                return !!get().items.find((i) => i.id === productId);
            },
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
