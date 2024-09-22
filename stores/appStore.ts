import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SubscriptionLevel } from '@/types';
import type { ProfileApiResponse } from '@/services/user/types';
import type { ExtendedNotification } from '@/types/helpers';

interface AppState {
  isLoading: boolean;
  profile: ProfileApiResponse | null;
  addNotification: (notification: ExtendedNotification) => void;
  isPaidMember: () => boolean;
  setProfile: (profile: ProfileApiResponse) => void;
  removeNotification: (notification: ExtendedNotification) => void;
  setLoading: (loading: boolean) => void;
  readNotifications: () => ExtendedNotification[];
  unreadNotifications: () => ExtendedNotification[];
}

const useAppStore = create<AppState>()(
  devtools((set, get) => ({
    isLoading: false,
    profile: null,

    setProfile: (profile: ProfileApiResponse) => set({ profile }),

    addNotification: (notification: ExtendedNotification) => set((state) => {
      if (state.profile) {
        return {
          profile: {
            ...state.profile,
            notifications: [...state.profile.notifications, notification],
          },
        };
      }
      return state;
    }),

    removeNotification: (notification: ExtendedNotification) => set((state) => {
      if (state.profile) {
        return {
          profile: {
            ...state.profile,
            notifications: state.profile.notifications.filter((n) => n.id !== notification.id),
          },
        };
      }
      return state;
    }),

    readNotifications: () => {
      const { profile } = get();
      return (profile?.notifications?.filter((n) => n.read_on_date) || []) as ExtendedNotification[];
    },

    unreadNotifications: () => {
      const { profile } = get();
      return (profile?.notifications?.filter((n) => !n.read_on_date) || []) as ExtendedNotification[];
    },

    isPaidMember: () => {
      const { profile } = get();
      if (!profile) return false;
      return profile.subscriptions[0]?.prices.identifier === SubscriptionLevel.ANNUAL || profile.subscriptions[0]?.prices.identifier === SubscriptionLevel.MONTHLY || profile.subscriptions[0]?.prices.identifier === SubscriptionLevel.LIFE;
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),
  }), { name: 'AppStore' }),
);

export default useAppStore;