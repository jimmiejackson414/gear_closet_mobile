import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Tables } from '@/types';

type Notification = Tables<'notifications'>;

interface AppState {
  notifications: Notification[];
  isLoading: boolean;
  addNotification: (notification: Notification) => void;
  removeNotification: (notification: Notification) => void;
  setLoading: (loading: boolean) => void;
}

const useAppStore = create<AppState>()(
  devtools((set) => ({
    notifications: [],
    isLoading: false,

    addNotification: (notification: Notification) => set((state) => ({ notifications: [...state.notifications, notification] })),
    removeNotification: (notification: Notification) => set((state) => ({ notifications: state.notifications.filter((n) => n.id !== notification.id) })),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
  }), { name: 'AppStore' }),
);

export default useAppStore;