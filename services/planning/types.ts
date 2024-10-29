import type { Tables } from '@/types';
import type { ExtendedPack, ExtendedPoll } from '@/types/helpers';

export interface PlanningPageData {
  trips: Tables<'trips'>[];
  pack?: ExtendedPack;
  trip_details: Tables<'trip_details'>[];
  todos: Tables<'todos'>[];
  shopping_items: Tables<'shopping_list_items'>[];
  friends: Tables<'trip_friends'>[];
  poll?: ExtendedPoll;
  errors?: string[];
}

export type QueryKey = [string, number];