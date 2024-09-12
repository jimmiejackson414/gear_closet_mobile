import axios from 'axios';
import { DashboardResponse, ForumResponse, GetDashboardData } from './types';
import { supabase } from '@/lib/supabase';

const fetchForumPosts = async () => {
  try {
    const { data } = await axios.get<ForumResponse>('/forums');
    return data;
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return null;
  }
};

/**
  * Fetches the dashboard data for the current user
 * @returns DashboardData | null
 */
export const fetchDashboardData = async (): Promise<DashboardResponse | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log({ user });

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase.rpc('get_dashboard_data', { p_user_id: user?.id })
      .returns<GetDashboardData>();
    console.log({ data, error });

    if (error || !data) throw new Error(error?.message);

    const forumData = await fetchForumPosts();
    console.log({ forumData });

    return { ...data, forums: forumData };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
};