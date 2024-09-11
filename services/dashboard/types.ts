import { Tables } from '@/types';
import { ExtendedFriend } from '@/types/helpers';

export interface DashboardData {
  friends: ExtendedFriend[];
  trips: Tables<'trips'>[];
  trip_friends: Tables<'trip_friends'>[];
}