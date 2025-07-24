import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null, imageUrl = null) => {
    const prodId = product._id || product.id;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => 
          (item._id || item.id) === prodId && 
          item.color === selectedColor && 
          item.size === selectedSize
      );

      if (existingItem) {
        // Update quantity if item exists with same color and size
        return prevItems.map(item =>
          (item._id || item.id) === prodId && 
          item.color === selectedColor && 
          item.size === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Add new item
      return [...prevItems, {
        _id: product._id || product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: imageUrl || (product.images && product.images[0] && (product.images[0].startsWith('http') || product.images[0].startsWith('/') ? product.images[0] : `${API_URL.replace('/api', '')}/${product.images[0].startsWith('/') ? product.images[0].substring(1) : product.images[0]}`)) || (product.image && (product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `${API_URL.replace('/api', '')}/${product.image.startsWith('/') ? product.image.substring(1) : product.image}`)) || 'https://placehold.co/400x500/333/FFF?text=Product',
        color: selectedColor,
        size: selectedSize,
        quantity,
        stock: product.stock
      }];
    });
  };

  // Remove item from cart
  const removeFromCart = (productId, color, size) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !((item._id || item.id) === productId && 
          item.color === color && 
          item.size === size)
      )
    );
  };

  // Update item quantity
  const updateQuantity = (productId, color, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item._id || item.id) === productId && 
        item.color === color && 
        item.size === size
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate totals
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 