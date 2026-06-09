import { createContext } from "react";

export interface CartContextType {
  cartCount: number;
  addToCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);