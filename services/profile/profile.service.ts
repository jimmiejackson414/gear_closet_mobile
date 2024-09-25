import { supabase } from '@/lib/supabase';
import type { TablesUpdate } from '@/types';
import type { ExtendedProfile } from '@/types/helpers';

/**
 * Fetches the profile data for the current user
 * @returns ExtendedProfile
 */
export const fetchProfile = async (): Promise<ExtendedProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase.from('profiles')
    .select(`
      *,
      onboarding_steps(*),
      notifications!notifications_profile_id_fkey(*, sender:sender_id(*)),
      subscriptions(*, prices(*))
    `)
    .eq('id', user.id)
    .returns<ExtendedProfile>()
    .single();

  if (error || !data) throw new Error(error?.message || 'Profile not found');

  return data;
};

/**
 * Updates the user's profile
 * @param profile
 * @returns profile | null
 */
export const updateProfile = async (profile: TablesUpdate<'profiles'>) => {
  try {
    const { data, error } = await supabase.from('profiles')
      .update(profile)
      .match({ id: profile.id });

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    return null;
  }
};

/**
 * Updates a user's notification
 * @param id
 * @returns notification | null
 */
export const updateNotification = async (id: string, payload: TablesUpdate<'notifications'>) => {
  try {
    const { data, error } = await supabase.from('notifications')
      .update(payload)
      .match({ id });

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    return null;
  }
};