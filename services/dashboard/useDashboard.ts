import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from './dashboard.service';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};