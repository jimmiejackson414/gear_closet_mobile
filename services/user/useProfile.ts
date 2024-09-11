import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from './profile.service';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};