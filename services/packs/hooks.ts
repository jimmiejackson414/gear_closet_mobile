import { useQuery } from '@tanstack/react-query';
import { fetchPacks } from './packs.service';

const keys = { getPacks: ['packs'] };

export const usePacks = (enabled: boolean) => {
  return useQuery({
    queryKey: keys.getPacks,
    queryFn: fetchPacks,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled,
  });
};