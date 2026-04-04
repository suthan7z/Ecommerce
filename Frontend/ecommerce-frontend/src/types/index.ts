export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Bug fix: role was missing from User type
}

export interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating?: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
   image: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

// Bug fix #12: AuthContextType was missing isLoading
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}
