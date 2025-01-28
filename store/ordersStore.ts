import { create } from 'zustand';

interface OrdersStore {
  availableOrdersCount: number;
  setAvailableOrdersCount: (count: number) => void;
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  availableOrdersCount: 0,
  setAvailableOrdersCount: (count) => set({ availableOrdersCount: count }),
}));