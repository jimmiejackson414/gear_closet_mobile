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
 * @returns ExtendedProfile
 */
export const updateProfile = async (profile: TablesUpdate<'profiles'>): Promise<ExtendedProfile> => {
  const { data, error } = await supabase.from('profiles')
    .update(profile)
    .match({ id: profile.id })
    .select(`
      *,
      onboarding_steps(*),
      notifications!notifications_profile_id_fkey(*, sender:sender_id(*)),
      subscriptions(*, prices(*))
    `)
    .returns<ExtendedProfile>()
    .single();

  if (error || !data) throw new Error(error?.message || 'Profile update failed');

  return data;
};

/**
 * Updates the user's avatar
 * @param avatar
 * @returns ExtendedProfile
 */
export const updateAvatar = async (avatar: string): Promise<ExtendedProfile> => {
  const profileId = await supabase.auth.getUser()
    ?.then(u => u?.data?.user?.id);
  if (!profileId) throw new Error('User not authenticated');

  // get the list of files in the user's avatar directory
  const { data: files, error: listError } = await supabase.storage.from('avatars')
    .list(`${profileId}/`);
  if (listError) throw new Error(listError.message);

  // delete the existing avatar
  if (files?.length > 0) {
    const { error: deleteError } = await supabase.storage.from('avatars')
      .remove(files.map(f => f.name));
    if (deleteError) throw new Error(deleteError.message);
  }

  // upload the new file
  const { error: uploadError } = await supabase.storage.from('avatars')
    .upload(`${profileId}/${avatar}`, avatar, { upsert: true });
  if (uploadError) throw new Error(uploadError.message);

  return fetchProfile();
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