import { useEffect } from 'react';
import { toast } from 'sonner-native';

const useErrorHandling = (error: any, message: string) => {
  useEffect(() => {
    if (error) toast.error(message);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
};

export default useErrorHandling;