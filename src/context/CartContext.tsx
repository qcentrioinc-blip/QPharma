import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface CartItem {
    id: number;
    title: string;
    subtitle: string;
    price: string;
    mrp: string;
    save: string;
    category: string;
    quantity: number;
    image?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: number, category: string) => void;
    updateQuantity: (id: number, category: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[₹,]/g, "")) || 0;
};

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const stored = localStorage.getItem("qpharma-cart");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });


    useEffect(() => {
        localStorage.setItem("qpharma-cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existing = prev.find(
                (item) => item.id === product.id && item.category === product.category
            );
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id && item.category === product.category
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number, category: string) => {
        setItems((prev) =>
            prev.filter((item) => !(item.id === id && item.category === category))
        );
    };

    const updateQuantity = (id: number, category: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id, category);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.id === id && item.category === category
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + parsePrice(item.price) * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
