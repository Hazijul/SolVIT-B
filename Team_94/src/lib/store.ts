import { create } from 'zustand';
import type { Database } from './database.types';

type Item = Database['public']['Tables']['items']['Row'] & {
  shops: Database['public']['Tables']['shops']['Row'];
};

interface CartItem extends Item {
  quantity: number;
}

interface UserState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
  } | null;
  setUser: (user: { id: string; email: string; } | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: async (email) => {
    // For testing, set a dummy user
    set({
      isAuthenticated: true,
      user: {
        id: 'test-user-id',
        email
      }
    });
  },
  logout: () => set({ isAuthenticated: false, user: null })
}));

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existingItem = state.items.find(i => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map(i =>
          i.id === item.id
            ? { ...i, quantity: Math.min(i.quantity + 1, item.stock) }
            : i
        )
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (itemId) => set((state) => ({
    items: state.items.filter(item => item.id !== itemId)
  })),
  updateQuantity: (itemId, quantity) => set((state) => ({
    items: state.items.map(item =>
      item.id === itemId
        ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }
        : item
    )
  })),
  clearCart: () => set({ items: [] })
}));