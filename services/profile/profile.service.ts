import axios from 'axios';
import { decode } from 'base64-arraybuffer';
import { toast } from 'sonner-native';
import { supabase } from '@/lib/supabase';
import type { TablesUpdate } from '@/types';
import type { ExtendedProfile, SubscriptionApiResponse } from '@/types/helpers';
import type { ImagePickerAsset } from 'expo-image-picker';

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ORIGIN_URL,
  headers: { 'Accept': 'application/json' },
});

/**
 * Fetches the profile data for the current user
 * @returns ExtendedProfile
 */
export const fetchProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.from('profiles')
      .select(`
      *,
      onboarding_steps(*),
      notifications!notifications_profile_id_fkey(*, sender:sender_id(*)),
      subscriptions(*, prices(*)),
      preferences(*)
    `)
      .eq('id', user.id)
      .returns<ExtendedProfile>()
      .single();

    if (error || !data) throw new Error(error?.message || 'Profile not found');

    return data;
  } catch (error) {
    toast.error('Failed to fetch profile data');
    return null;
  }
};

/**
 * Fetches the profile's subscription data from Stripe
 * @returns Subscription
 */
export const fetchSubscription = async () => {
  try {
    
    const { data: session, error } = await supabase.auth.getSession();

    if (error || !session) {
      throw new Error('User not authenticated');
    }

    const token = session.session?.access_token;
    const { data } = await client.get<SubscriptionApiResponse>('/api/stripe/subscription', { headers: { Authorization: `Bearer ${token}` } });
    return data;
  } catch (error) {
    console.error(error);
    toast.error('Failed to fetch subscription data');
    return null;
  }
};

/**
 * Updates the user's profile
 * @param profile
 * @returns ExtendedProfile
 */
export const updateProfile = async (payload: TablesUpdate<'profiles'>) => {
  const { data: userData } = await supabase.auth.getUser();
  const profileId = userData?.user?.id;
  if (!profileId) throw new Error('User not authenticated');

  const { data, error } = await supabase.from('profiles')
    .update(payload)
    .match({ id: profileId })
    .select(`
      *,
      onboarding_steps(*),
      notifications!notifications_profile_id_fkey(*, sender:sender_id(*)),
      subscriptions(*, prices(*))
    `)
    .returns<ExtendedProfile>()
    .single();

  if (payload.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email: payload.email });

    if (emailError) throw new Error(emailError.message || 'User email update failed');
  }

  if (error || !data) throw new Error(error?.message || 'Profile update failed');

  return data;
};

/**
 * Updates the user's avatar
 * @param asset
 * @returns ExtendedProfile
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const updateAvatar = async (asset: ImagePickerAsset) => {
  if (!asset) throw new Error('No asset provided');

  const { data } = await supabase.auth.getUser();
  const profileId = data?.user?.id;
  if (!profileId) throw new Error('User not authenticated');

  // Check if the file size is defined and exceeds the maximum allowed size
  if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
    throw new Error('The file size exceeds the maximum allowed size of 5MB');
  }

  // Fetch the Blob from the URI
  const response = await fetch(asset.uri);
  const blob = await response.blob();

  // Get the list of files in the user's avatar directory
  const { data: files, error: listError } = await supabase.storage.from('avatars')
    .list(`${profileId}/`);
  if (listError) throw new Error(listError.message);

  // Delete the existing avatar
  if (files?.length > 0) {
    const { error: deleteError } = await supabase.storage.from('avatars')
      .remove(files.map(f => `${profileId}/${f.name}`));
    if (deleteError) throw new Error(deleteError.message);
  }

  // Convert the Blob to a base64 string
  const reader = new FileReader();
  const uploadPromise = new Promise<ExtendedProfile>((resolve, reject) => {
    reader.onloadend = async () => {
      try {
        const base64data = reader.result as string;
        const base64Str = base64data.includes('base64,')
          ? base64data.substring(base64data.indexOf('base64,') + 'base64,'.length)
          : base64data;
        const arrayBuffer = decode(base64Str);

        if (!(arrayBuffer.byteLength > 0)) {
          throw new Error('ArrayBuffer is null');
        }

        // Upload the new file as an ArrayBuffer
        const { error: uploadError } = await supabase.storage.from('avatars')
          .upload(`${profileId}/${asset.fileName}`, arrayBuffer, { contentType: asset.mimeType });
        if (uploadError) throw new Error('The file size exceeds the maximum allowed size of 5MB');

        // Update the profile with the new avatar path
        const updatedProfile = await updateProfile({ id: profileId, image: `${profileId}/${asset.fileName}` });

        resolve(updatedProfile);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = error => {
      console.error('FileReader error:', error);
      reject(new Error('Failed to read file'));
    };
  });

  reader.readAsDataURL(blob);

  return uploadPromise;
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

/**
 * Updates a user's preferences
 * @param <Tables<'preferences'>>
 * @returns ExtendedProfile
 */
export const updatePreference = async (payload: TablesUpdate<'preferences'>) => {
  const { data } = await supabase.auth.getUser();
  const profileId = data?.user?.id;
  if (!profileId) throw new Error('User not authenticated');

  const { error } = await supabase.from('preferences')
    .update(payload)
    .match({ id: payload.id });

  if (error) throw new Error(error.message);

  return fetchProfile();
};