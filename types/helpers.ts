import type { Tables } from '@/types';
import type { Stripe } from 'stripe';

export type SubscriptionType = Tables<'subscriptions'> & {
  prices: Tables<'prices'>;
};

export type SubscriptionApiResponse = {
  customer?: Stripe.Customer;
  subscriptions: Stripe.Subscription[];
  nextBillingDate: number | null;
  paymentMethods: Stripe.PaymentMethod[];
  invoices: Stripe.Invoice[];
};

export type ExtendedCategoryItem = Tables<'category_items'> & {
  item: Tables<'items'>
};

export type ExtendedCategory = Tables<'categories'> & {
  [key: string]: any;
  category_items: ExtendedCategoryItem[];
};

export type ExtendedPack = Tables<'packs'> & {
  categories: ExtendedCategory[];
};

export type ExtendedUser = Tables<'profiles'> & {
  onboarding_steps: Tables<'onboarding_steps'>[];
};

export type ExtendedFriend = Tables<'friends'> & {
  profile?: Tables<'profiles'>;
  friend: Tables<'profiles'>;
};

export type ExtendedFriendInvite = Tables<'friend_invitations'> & {
  recipient: Tables<'profiles'>;
  sender: Tables<'profiles'>;
};

export type ExtendedNotification = Tables<'notifications'> & {
  sender: Tables<'profiles'>;
};

export type ExtendedPoll = Tables<'polls'> & {
  question: Tables<'questions'>;
  answers: Tables<'answers'>[];
  votes: Tables<'profile_answers'>[];
};

export type ExtendedReply = Tables<'replies'> & {
  profile: Tables<'profiles'>;
};

export type ExtendedComment = Tables<'comments'> & {
  profile: Tables<'profiles'>;
  replies: ExtendedReply[];
};

export interface PublicPack extends ExtendedPack {
  profile: Tables<'profiles'>;
  comments: ExtendedComment[];
}

export type SelectOption = {
  label: string;
  value: string | number;
};

// Closet page CSV import results
export type ParsedResults = {
  data: any[];
  errors: string[];
  meta: {
    aborted: boolean;
    cursor: number;
    delimiter: string;
    fields: string[];
    linebreak: string;
    truncated: boolean;
  }
};

export type ImportClosetCsvResponse = {
  categories: ExtendedCategory[];
};