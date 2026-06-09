import { useState } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};