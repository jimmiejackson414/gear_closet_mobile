import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPack, fetchPacks, updatePack } from './packs.service';

const keys = { getPacks: ['packs'] };

/**
 * Packs Query
 * @param enabled
 */
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

/**
 * Pack Query
 * @param packId
 */
export const usePack = (packId: number) => {
  return useQuery({
    queryKey: ['pack', packId],
    queryFn: () => fetchPack(packId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

/**
 * Pack Mutation
 */
export const useUpdatePackMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.getPacks });
    },
  });
};