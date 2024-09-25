import axios from 'axios';
import { supabase } from '@/lib/supabase';
import type { ForumResponse, GetDashboardData } from './types';

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ORIGIN_URL,
  headers: {
    'Accept': 'application/json',
    'Api-Key': process.env.EXPO_FORUMS_API_KEY,
    'Api-Username': 'system',
  },
});

/**
 * Fetches the latest forum posts
 * @returns ForumResponse | null
 */
const fetchForumPosts = async () => {
  try {
    const { data } = await client.get<ForumResponse>('/api/forums');

    // map over latest_posts to add `category_color` property
    if (data) {
      data.latest_posts = data.latest_posts.map(post => {
        const category = data.categories.find(category => category.id === post.category_id);
        return { ...post, category_color: category?.color };
      });
    }
    return data;
  } catch (error) {
    return null;
  }
};

/**
  * Fetches the dashboard data for the current user
 * @returns DashboardData | null
 */
export const fetchDashboardData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase.rpc('get_dashboard_data', { p_user_id: user?.id })
      .returns<GetDashboardData>();

    if (error || !data) throw new Error(error?.message);

    const forums = await fetchForumPosts();

    return { ...data, forums };
  } catch (error) {
    return null;
  }
};