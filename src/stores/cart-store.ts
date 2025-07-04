import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
};

type CartStore = {
    items: CartItem[];
    isLoading: boolean;
    isOpen: boolean;
    cartId: string | null;
    setStore: (store: Partial<CartStore>) => void;
    addItem: (item: CartItem) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    updateItemQuantity: (id: string, quantity: number) => Promise<void>;
    clear: () => void;
    open: () => void;
    close: () => void;
    setLoading: (loading: boolean) => void;
    syncWithUser: () => Promise<void>;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

