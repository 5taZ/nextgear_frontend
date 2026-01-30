import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Product, CartItem, User, Order, OrderStatus, ADMIN_TELEGRAM_USERNAME } from '../types';
import { INITIAL_PRODUCTS as INIT_PRODS } from '../constants';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  orders: Order[]; // Global list of orders
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  placeOrder: () => void;
  processOrder: (orderId: string, approved: boolean) => void;
  isAdmin: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INIT_PRODS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Initialize from Telegram WebApp
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    
    if (tg) {
        tg.ready();
        tg.expand(); 

        const tgUser = tg.initDataUnsafe?.user;
        
        if (tgUser) {
            setUser({
                username: tgUser.username || `User_${tgUser.id}`,
                balance: 0,
                referrals: 0,
                referralLink: `https://t.me/ResellHubBot?start=${tgUser.id}`,
                isAdmin: tgUser.username === ADMIN_TELEGRAM_USERNAME
            });
        } else {
            setUser({
                username: 'guest_user',
                balance: 0,
                referrals: 0,
                referralLink: 'https://t.me/ResellHubBot?start=guest',
                isAdmin: false 
            });
        }
    }
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [product, ...prev]);
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  // --- Order Logic ---

  const placeOrder = useCallback(() => {
    if (!user || cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const newOrder: Order = {
        id: Date.now().toString(),
        userId: user.username, // Using username as ID for simplicity in this demo
        username: user.username,
        items: [...cart],
        totalAmount: total,
        status: OrderStatus.PENDING,
        date: Date.now()
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]); // Clear cart after placing order
  }, [user, cart]);

  const processOrder = useCallback((orderId: string, approved: boolean) => {
    setOrders(prevOrders => {
        return prevOrders.map(order => {
            if (order.id !== orderId) return order;
            
            // If approved, remove items from global inventory
            if (approved) {
                const itemIdsToRemove = order.items.map(i => i.id);
                setProducts(prevProds => prevProds.filter(p => !itemIdsToRemove.includes(p.id)));
            }

            return {
                ...order,
                status: approved ? OrderStatus.CONFIRMED : OrderStatus.CANCELED
            };
        });
    });
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        user,
        orders,
        addToCart,
        removeFromCart,
        clearCart,
        addProduct,
        removeProduct,
        placeOrder,
        processOrder,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};