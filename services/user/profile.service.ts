import { supabase } from '@/lib/supabase';
import type { ProfileApiResponse } from './types';

/**
 * Fetches the profile data for the current user
 * @returns ProfileApiResponse | null
 */
export const fetchProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error;

    const { data, error } = await supabase.from('profiles')
      .select(`
        *,
        onboarding_steps(*),
        notifications!notifications_profile_id_fkey(*, sender:sender_id(*)),
        subscriptions(*, prices(*))
      `)
      .eq('id', user.id)
      .returns<ProfileApiResponse>()
      .single();

    if (error) throw error;

    return data as ProfileApiResponse;
  } catch (error) {
    return null;
  }
};