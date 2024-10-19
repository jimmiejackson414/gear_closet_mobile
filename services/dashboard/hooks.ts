import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from './dashboard.service';

const keys = { getDashboard: ['dashboardData'] };

/**
 * Dashboard Query
 * @returns GetDashboardData
 */
export const useDashboardQuery = () => {
  return useQuery({
    queryKey: keys.getDashboard,
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};