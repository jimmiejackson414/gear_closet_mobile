import { DashboardData } from './types';
import { supabase } from '@/lib/supabase';

/**
  * Fetches the dashboard data for the current user
 * @returns DashboardData | null
 */
export const fetchDashboardData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    const { data, error } = await supabase.rpc('get_dashboard_data', { p_user_id: user?.id })
      .returns<DashboardData>();

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
};