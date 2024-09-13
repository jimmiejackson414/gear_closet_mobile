import { Tables } from '@/types';
import { supabase } from '@/lib/supabase';

interface FriendlyUsernameOptions {
  includeTrailName?: boolean;
}

export const initials = (user: Tables<'profiles'> | null | undefined) => {
  const base = 'GC';
  if (!user) return base;
  const firstInitial = user.first_name?.charAt(0);
  const lastInitial = user.last_name?.charAt(0);
  return firstInitial && lastInitial ? `${firstInitial}${lastInitial}` : base;
};

export const friendlyUsername = (user: Tables<'profiles'> | null | undefined, options?: FriendlyUsernameOptions) => {
  if (!user) return initials(user);
  if (options?.includeTrailName && user.trail_name) {
    return `${user.first_name} "${user.trail_name}" ${user.last_name}`;
  }
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (user.first_name && !user.last_name) return user.first_name;
  return user.email;
};

export const buildImageSrc = (url: string | undefined | null) => {
  if (!url) return undefined;
  const { data } = supabase.storage.from('avatars')
    .getPublicUrl(url);
  return data?.publicUrl ?? undefined;
};

export const truncate = (str: string | null | undefined, num = 100) => {
  if (!str) return '';
  return num >= str.length ? str : `${str.substring(0, num)}...`;
};