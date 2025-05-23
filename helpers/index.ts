import { supabase } from '@/lib/supabase';
import { SubscriptionLevel } from '@/types';
import type { AppTheme } from '@/hooks/useAppTheme';
import type { Tables } from '@/types';

export { default as makeStyles } from './makeStyles';

interface FriendlyUsernameOptions {
  includeTrailName?: boolean;
}

/**
 * Builds the image src from the Supabase storage bucket
 * @param url
 * @returns string | undefined
 */
export const buildImageSrc = (url: string | undefined | null) => {
  if (!url) return undefined;
  const { data } = supabase.storage.from('avatars')
    .getPublicUrl(url);
  return data?.publicUrl ?? undefined;
};

/**
 * Capitalizes the first letter of each word in a string
 * @param text
 * @returns string
 */
export const capitalize = (text: string | undefined | null) => {
  if (!text) return '';

  const splitStr = text.toLowerCase()
    .split(' ');

  for (let i = 0; i < splitStr.length; i += 1) {
    splitStr[i] = splitStr[i].charAt(0)
      .toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
};

/**
 * Returns a friendly username
 * @param user
 * @param options
 * @returns string
 */
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

/**
 * Formats the display text
 * @param text
 * @returns string
 * @example formatDisplayText('american_express') => 'American Express'
 */
export const formatDisplayText = (text: string | null | undefined) => {
  if (!text) return '';
  return capitalize(text.replace(/_/g, ' '));
};

/**
 * Returns the badge color based on the subscription level
 * @param subscription
 * @param theme
 * @returns
 */
export const getBadgeColor = (subscription: SubscriptionLevel, theme: AppTheme) => {
  switch (subscription) {
    case SubscriptionLevel.FREE:
      return { background: theme.colors.quarternaryContainer, color: theme.colors.onQuarternary };
    case SubscriptionLevel.MONTHLY:
      return { background: theme.colors.tertiaryContainer, color: theme.colors.onSurface };
    case SubscriptionLevel.ANNUAL, SubscriptionLevel.LIFE:
      return { background: theme.colors.primaryContainer, color: theme.colors.onPrimary };
    default:
      return { background: theme.colors.primary, color: theme.colors.onPrimary };
  }
};

/**
 * Returns the user's initials
 * @param user
 * @returns string
 */
export const initials = (user: Tables<'profiles'> | null | undefined) => {
  const base = 'GC';
  if (!user) return base;
  const firstInitial = user.first_name?.charAt(0);
  const lastInitial = user.last_name?.charAt(0);
  return firstInitial && lastInitial ? `${firstInitial}${lastInitial}` : base;
};

export const truncate = (str: string | null | undefined, num = 100) => {
  if (!str) return '';
  return num >= str.length ? str : `${str.substring(0, num)}...`;
};