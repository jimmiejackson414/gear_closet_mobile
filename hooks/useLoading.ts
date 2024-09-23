import { useEffect } from 'react';
import useAppStore from '@/stores/appStore';

const useLoading = (isLoading: boolean) => {
  const setLoading = useAppStore(state => state.setLoading);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);
};

export default useLoading;