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

export type CartView = "cart" | "wishlist";

interface CartContextType {
    items: CartItem[];
    wishlistItems: CartItem[];
    addToCart: (product: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: number, category: string) => void;
    updateQuantity: (id: number, category: string, quantity: number) => void;
    clearCart: () => void;
    addToWishlist: (product: Omit<CartItem, "quantity">) => void;
    removeFromWishlist: (id: number, category: string) => void;
    toggleWishlistItem: (product: Omit<CartItem, "quantity">) => void;
    isInWishlist: (id: number, category: string) => boolean;
    totalItems: number;
    totalPrice: number;
    wishlistCount: number;
    isCartOpen: boolean;
    cartView: CartView;
    openCart: (view?: CartView) => void;
    closeCart: () => void;
    setCartView: (view: CartView) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[₹,]/g, "")) || 0;
};

const readStoredItems = <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    try {
        const stored = window.localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
};

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => readStoredItems("qpharma-cart", []));
    const [wishlistItems, setWishlistItems] = useState<CartItem[]>(() => readStoredItems("qpharma-wishlist", []));
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartView, setCartView] = useState<CartView>("cart");

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("qpharma-cart", JSON.stringify(items));
        }
    }, [items]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("qpharma-wishlist", JSON.stringify(wishlistItems));
        }
    }, [wishlistItems]);

    const openCart = (view: CartView = "cart") => {
        setCartView(view);
        setIsCartOpen(true);
    };

    const closeCart = () => setIsCartOpen(false);

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
        openCart("cart");
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

    const addToWishlist = (product: Omit<CartItem, "quantity">) => {
        setWishlistItems((prev) => {
            if (prev.some((item) => item.id === product.id && item.category === product.category)) {
                return prev;
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        openCart("wishlist");
    };

    const removeFromWishlist = (id: number, category: string) => {
        setWishlistItems((prev) =>
            prev.filter((item) => !(item.id === id && item.category === category))
        );
    };

    const toggleWishlistItem = (product: Omit<CartItem, "quantity">) => {
        if (isInWishlist(product.id, product.category)) {
            removeFromWishlist(product.id, product.category);
            return;
        }
        addToWishlist(product);
    };

    const isInWishlist = (id: number, category: string) =>
        wishlistItems.some((item) => item.id === id && item.category === category);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + parsePrice(item.price) * item.quantity,
        0
    );
    const wishlistCount = wishlistItems.length;

    return (
        <CartContext.Provider
            value={{
                items,
                wishlistItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                addToWishlist,
                removeFromWishlist,
                toggleWishlistItem,
                isInWishlist,
                totalItems,
                totalPrice,
                wishlistCount,
                isCartOpen,
                cartView,
                openCart,
                closeCart,
                setCartView,
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
