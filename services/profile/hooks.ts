import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SubscriptionLevel } from '@/types';
import { fetchProfile, updateAvatar, updateProfile } from './profile.service';
import type { ExtendedNotification, ExtendedProfile } from '@/types/helpers';
import type { UseMutationOptions, UseQueryResult } from '@tanstack/react-query';

const keys = { getProfile: ['profile'] };

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
  options?: UseMutationOptions<ExtendedProfile, Error, string>,
) => {
  const queryClient = useQueryClient();
  return useMutation<ExtendedProfile, Error, string>({
    mutationFn: updateAvatar,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: keys.getProfile });
      if (options?.onSuccess) options.onSuccess(data, variables, context);
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