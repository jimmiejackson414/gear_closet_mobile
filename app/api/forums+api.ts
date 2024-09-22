import axios from 'axios';
import * as dotenv from 'dotenv';
import type { ForumCategories, ForumLatestPosts } from '@/services/dashboard/types';

dotenv.config();

const forumsUrl = process.env.EXPO_PUBLIC_FORUMS_URL;
const apiKey = process.env.EXPO_FORUMS_API_KEY;

const client = axios.create({
  baseURL: forumsUrl, headers: {
    'Accept': 'application/json',
    'Api-Key': apiKey,
    'Api-Username': 'system',
  },
});

export async function GET() {
  try {
    const { status: latestPostsStatus, data: latestPostsData } = await client.get<ForumLatestPosts>('/posts');

    if (latestPostsStatus !== 200) {
      return Response.json({ error: 'Failed to fetch forum posts' }, { status: latestPostsStatus  });
    }

    const { status: categoriesStatus, data: categoriesData } = await client.get<ForumCategories>('/categories');

    if (categoriesStatus !== 200) {
      return Response.json({ error: 'Failed to fetch forum categories' }, { status: categoriesStatus });
    }

    if (latestPostsData?.latest_posts?.length && categoriesData?.category_list?.categories?.length) {
      latestPostsData.latest_posts = latestPostsData.latest_posts.filter(p => p.username !== 'system')
        .slice(0, 10);
    }

    const data = {
      latest_posts: latestPostsData.latest_posts || [],
      categories: categoriesData.category_list.categories || [],
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}