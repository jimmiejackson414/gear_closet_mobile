import type { Tables } from '@/types';
import type { ExtendedNotification, SubscriptionType } from '@/types/helpers';

export type ProfileApiResponse = Tables<'profiles'> & {
  onboarding_steps: Tables<'onboarding_steps'>[];
  notifications: ExtendedNotification[];
  subscriptions: SubscriptionType[];
} | null;