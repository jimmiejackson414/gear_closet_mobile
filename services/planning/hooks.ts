import { useQuery } from '@tanstack/react-query';
import { fetchPlanningData } from './planning.service';

// const keys = { getPlanning: ['planningData'] };
const keys = { getPlanning: (tripId: number): [string, number] => ['planningData', tripId] };

/**
 * Planning Query
 * @returns GetPlanningData
 */
export const usePlanningQuery = (tripId: number) => {
  return useQuery({
    queryKey: keys.getPlanning(tripId),
    queryFn: fetchPlanningData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};