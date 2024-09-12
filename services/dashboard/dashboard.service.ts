import axios from 'axios';
import { DashboardResponse, ForumResponse, GetDashboardData } from './types';
import { supabase } from '@/lib/supabase';

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ORIGIN_URL,
  headers: {
    'Accept': 'application/json',
    'Api-Key': process.env.EXPO_FORUMS_API_KEY,
    'Api-Username': 'system',
  },
});

const fetchForumPosts = async () => {
  try {
    const { data } = await client.get<ForumResponse>('/api/forums');
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

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase.rpc('get_dashboard_data', { p_user_id: user?.id })
      .returns<GetDashboardData>();

    if (error || !data) throw new Error(error?.message);

    const forums = await fetchForumPosts();

    return { ...data, forums };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
};