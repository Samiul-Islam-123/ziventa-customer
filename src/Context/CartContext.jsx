// CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const updateCart = (newCart) => {
    setCart(newCart);
  };

  const contextValue = {
    cart,
    updateCart,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

const useCart = () => {
  return useContext(CartContext);
};

export { CartProvider, useCart };
