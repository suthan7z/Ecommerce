import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Cart, CartItem, CartContextType, Product } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: Cart = {
  items: [],
  totalAmount: 0,
};

const loadCart = (): Cart => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : initialState;
  } catch {
    return initialState;
  }
};

const cartReducer = (state: Cart, action: any) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const productId = product._id || product.id;
      const existingItem = state.items.find(item => item.id === productId);

      let updatedItems: CartItem[];
      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updatedItems = [
          ...state.items,
          { image: product.image,  id: productId, name: product.name, price: product.price, quantity },
        ];
      }

      return {
        ...state,
        items: updatedItems,
        totalAmount: updatedItems.reduce((total, item) => total + item.price * item.quantity, 0),
      };
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        totalAmount: filteredItems.reduce((total, item) => total + item.price * item.quantity, 0),
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItemsQty = state.items.map(item =>
        item.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItemsQty,
        totalAmount: updatedItemsQty.reduce((total, item) => total + item.price * item.quantity, 0),
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // Bug fix: toast notifications on cart actions
  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    toast.success(`${product.name} added to cart`, {
      duration: 2000,
      style: { fontSize: '14px' },
    });
  };

  const removeFromCart = (productId: string) => {
    const item = state.items.find(i => i.id === productId);
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    if (item) {
      toast(`${item.name} removed from cart`, {
        duration: 2000,
        style: { fontSize: '14px' },
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const value: CartContextType = {
    cart: state,
    addToCart,
    removeFromCart,
    updateQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
