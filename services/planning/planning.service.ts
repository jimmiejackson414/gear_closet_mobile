import { toast } from 'sonner-native';
import { supabase } from '@/lib/supabase';
import type { PlanningPageData, QueryKey } from './types';

/**
 * Fetches the planning data
 */
export const fetchPlanningData = async ({ queryKey }: { queryKey: QueryKey }) => {
  const [_, tripId] = queryKey;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('get_planning_page_data', { p_trip_id: tripId || 0 })
      .returns<PlanningPageData>();

    if (error || !data) throw new Error(error?.message || 'Planning data not found');

    return data;
  } catch (error) {
    toast.error('Failed to fetch planning data');
    return null;
  }
};