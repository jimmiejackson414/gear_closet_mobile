import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Tables } from '@/types';

type Notification = Tables<'notifications'>;

interface AppState {
  notifications: Notification[]
}

const useAppStore = create<AppState>()(
  devtools((set) => ({
    notifications: [],

    addNotification: (notification: Notification) => set((state) => ({ notifications: [...state.notifications, notification] })),
    removeNotification: (notification: Notification) => set((state) => ({ notifications: state.notifications.filter((n) => n.id !== notification.id) })),
  })),
);

export default useAppStore;