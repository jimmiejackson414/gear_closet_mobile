import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SubscriptionLevel } from '@/types';
import { fetchProfile, updateProfile } from './profile.service';
import type { ExtendedNotification, ExtendedProfile } from '@/types/helpers';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

const keys = { getProfile: ['profile'] };

/**
 * Profile Query
 */
export const useProfile = <TData = ExtendedProfile>(
  options?: Omit<UseQueryOptions<ExtendedProfile, Error, TData>, 'queryKey'>,
): UseQueryResult<TData, Error> => {
  return useQuery<ExtendedProfile, Error, TData>({
    queryKey: keys.getProfile,
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    ...options,
  });
};

/**
 * Profile Mutation
 */
export const useUpdateProfileMutation = (options: any) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.getProfile });
      if (options.onSuccess) options.onSuccess();
    },
    ...options,
  });
};

/**
 * Derived State Hooks
 */
export const useReadNotifications = (): UseQueryResult<ExtendedNotification[], Error> => {
  return useProfile<ExtendedNotification[]>({
    select: (profile: ExtendedProfile) => {
      // TODO: Figure out why this is returning ExtendedNotification[] | undefined, instead of just ExtendedNotification[]
      return profile.notifications?.filter(n => n.read_on_date) || [];
    },
  });
};

export const useUnreadNotifications = (): UseQueryResult<ExtendedNotification[], Error> => {
  return useProfile<ExtendedNotification[]>({
    select: (profile: ExtendedProfile) => {
      // TODO: Figure out why this is returning ExtendedNotification[] | undefined, instead of just ExtendedNotification[]
      return profile.notifications?.filter(n => !n.read_on_date) || [];
    },
  });
};

export const useIsPaidMember = (): UseQueryResult<boolean, Error> => {
  return useProfile<boolean>({
    select: (profile: ExtendedProfile) => {
      return profile.subscriptions[0]?.prices.identifier === SubscriptionLevel.ANNUAL || profile.subscriptions[0]?.prices.identifier === SubscriptionLevel.MONTHLY || profile.subscriptions[0]?.prices.identifier === SubscriptionLevel.LIFE;
    },
  });
};