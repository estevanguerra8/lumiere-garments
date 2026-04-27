'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CartItem } from '@/data/types';

interface CartContextType {
  items: CartItem[];
  addItem: (productId: number, salePrice: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((productId: number, salePrice: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.ProductID === productId);
      if (existing) {
        return prev.map(i =>
          i.ProductID === productId
            ? { ...i, Quantity: i.Quantity + 1 }
            : i
        );
      }
      return [...prev, { ProductID: productId, Quantity: 1, SalePrice: salePrice }];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems(prev => prev.filter(i => i.ProductID !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.ProductID !== productId));
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.ProductID === productId ? { ...i, Quantity: quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.Quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.Quantity * i.SalePrice, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
