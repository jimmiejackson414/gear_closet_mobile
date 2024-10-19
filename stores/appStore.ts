import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const useAppStore = create<AppState>()(
  devtools(set => ({
    isLoading: false,

    setLoading: (loading: boolean) => set({ isLoading: loading }),
  }), { name: 'AppStore' }),
);

export default useAppStore;