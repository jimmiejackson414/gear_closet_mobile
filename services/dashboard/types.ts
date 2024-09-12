import { Tables } from '@/types';
import { ExtendedFriend } from '@/types/helpers';

export type ForumPost = {
  avatar_template: string;
  category_id: number;
  cooked: string;
  created_at: string;
  display_username: string;
  id: number;
  name: string;
  raw: string;
  reads: number;
  reply_count: number;
  topic_slug: string;
  topic_title: string;
  updated_at: string;
  username: string;
  categoryColor?: string;
};

export type ForumLatestPosts = {
  latest_posts: ForumPost[];
};

export type ForumCategory = {
  id: number;
  name: string;
  color: string;
  slug: string;
  topic_count: number;
  post_count: number;
  description: string;
  topic_url: string;
};

export type ForumCategories = {
  category_list: {
    categories: ForumCategory[];
  }
};

export interface ForumResponse {
  latest_posts: ForumPost[];
  categories: ForumCategory[];
}

export interface GetDashboardData {
  friends: ExtendedFriend[];
  total_friends_count: number;
  trips: Tables<'trips'>[];
  trip_friends: Tables<'trip_friends'>[];
}

export type DashboardResponse = GetDashboardData & {
  forums: ForumResponse;
};