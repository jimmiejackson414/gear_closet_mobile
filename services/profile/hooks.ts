import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SubscriptionLevel } from '@/types';
import { fetchProfile, fetchSubscription, updateAvatar, updatePreference, updateProfile } from './profile.service';
import type { TablesUpdate } from '@/types';
import type { ExtendedNotification, ExtendedProfile, SubscriptionApiResponse } from '@/types/helpers';
import type { UseMutationOptions, UseQueryResult } from '@tanstack/react-query';
import type { ImagePickerAsset } from 'expo-image-picker';

const keys = { getProfile: ['profile'], getSubscription: ['subscription'] };

/**
 * Profile Query
 */
export const useProfile = <TData = ExtendedProfile>(
  select?: (profile: ExtendedProfile) => TData,
): UseQueryResult<TData, Error> => {
  return useQuery<ExtendedProfile, Error, TData>({
    queryKey: keys.getProfile,
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    select,
  });
};

/**
 * Stripe subscription
 */
export const useSubscription = <TData = SubscriptionApiResponse>(
  select?: (subscription: SubscriptionApiResponse) => TData,
): UseQueryResult<TData, Error> => {
  return useQuery<SubscriptionApiResponse, Error, TData>({
    queryKey: keys.getSubscription,
    queryFn: fetchSubscription,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    select,
  });
};

/**
 * Profile Mutation
 */
export const useUpdateProfileMutation = (
  options?: UseMutationOptions<ExtendedProfile, Error, Partial<ExtendedProfile>>,
) => {
  const queryClient = useQueryClient();
  return useMutation<ExtendedProfile, Error, Partial<ExtendedProfile>>({
    mutationFn: updateProfile,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: keys.getProfile });
      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
    ...options,
  });
};

/**
 * Update avatar mutation
 */
export const useUpdateAvatarMutation = (
  options?: UseMutationOptions<ExtendedProfile, Error, ImagePickerAsset>,
) => {
  const queryClient = useQueryClient();
  return useMutation<ExtendedProfile, Error, ImagePickerAsset>({
    mutationFn: updateAvatar,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: keys.getProfile });
      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
    ...options,
  });
};

/**
 * Update profile preferences mutation
 */
export const useUpdatePreferenceMutation = (
  options?: UseMutationOptions<ExtendedProfile, Error, TablesUpdate<'preferences'>>,
) => {
  const queryClient = useQueryClient();
  return useMutation<ExtendedProfile, Error, TablesUpdate<'preferences'>>({
    mutationFn: updatePreference,
    onMutate: async newPreference => {
      await queryClient.cancelQueries({ queryKey: keys.getProfile });
      const previousData = queryClient.getQueryData<ExtendedProfile>(keys.getProfile);

      queryClient.setQueryData<ExtendedProfile>(keys.getProfile, old => {
        if (!old) return old;
        const updatedPreferences = old.preferences.map(pref =>
          pref.id === newPreference.id ? { ...pref, ...newPreference } : pref,
        );
        return { ...old, preferences: updatedPreferences };
      });

      return { previousData, newPreference };
    },
    onError: (error, newPreference, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData<ExtendedProfile>(keys.getProfile, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keys.getProfile });
    },
    ...options,
  });
};

/**
 * Derived State Hooks
 */
export const useReadNotifications = (): UseQueryResult<ExtendedNotification[], Error> => {
  return useProfile<ExtendedNotification[]>((profile: ExtendedProfile) => {
    return profile.notifications?.filter(n => n.read_on_date) || [];
  });
};

export const useUnreadNotifications = (): UseQueryResult<ExtendedNotification[], Error> => {
  return useProfile<ExtendedNotification[]>((profile: ExtendedProfile) => {
    return profile.notifications?.filter(n => !n.read_on_date) || [];
  });
};

export const useIsPaidMember = (): UseQueryResult<boolean, Error> => {
  return useProfile<boolean>((profile: ExtendedProfile) => {
    return profile.subscriptions[0]?.prices.identifier === SubscriptionLevel.ANNUAL || profile.subscriptions[0]?.prices.identifier === SubscriptionLevel.MONTHLY || profile.subscriptions[0]?.prices.identifier === SubscriptionLevel.LIFE;
  });
};