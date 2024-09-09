import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { toast } from 'sonner-native';

type ToastType = 'error' | 'warning' | 'info' | 'success';

interface ToastState {
  addToast: (message: string, type?: ToastType) => void;
  clearToasts: () => void;
}

interface AppState {
  toast: ToastState;
}

// Function to show toast based on type
const showToast = (message: string, type: ToastType) => {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    case 'info':
    default:
      toast(message);
      break;
  }
};

const useAppStore = create<AppState>()(
  devtools((set) => ({
    toast: {
      // actions
      addToast: (message, type = 'info') => {
        showToast(message, type);
      },

      clearToasts: () => {
        toast.dismiss();
      },
    },
  })),
);

export default useAppStore;