import { useEffect, useState } from 'react';
import { useDashboard } from '@/services/dashboard/useDashboard';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import UpcomingTripsWidget from '@/components/dashboard/UpcomingTripsWidget';
import type { ExtendedFriend } from '@/types/helpers';
import type { Tables } from '@/types';
import InvitationsWidget from '@/components/dashboard/InvitationsWidget';
import FriendsWidget from '@/components/dashboard/FriendsWidget';
import ForumsWidget from '@/components/dashboard/ForumsWidget';
import { VStack } from '@/components/ui';
import { useErrorHandling, useLoading  } from '@/hooks';

const HomeScreen = () => {
  const {
    data, error, isLoading,
  } = useDashboard();

  useLoading(isLoading);
  useErrorHandling(error, 'Failed to fetch dashboard data');

  const [friends, setFriends] = useState<ExtendedFriend[]>([]);
  const [trips, setTrips] = useState<Tables<'trips'>[]>([]);
  const [tripFriends, setTripFriends] = useState<Tables<'trip_friends'>[]>([]);
  useEffect(() => {
    if (data) {
      setFriends(data.friends);
      setTrips(data.trips);
      setTripFriends(data.trip_friends);
    }
  }, [data]);

  return (
    <ScreenWrapper>
      <VStack space="xl">
        <UpcomingTripsWidget data={trips} />
        <InvitationsWidget data={tripFriends} />
        <FriendsWidget data={friends} />
        <ForumsWidget />
      </VStack>
    </ScreenWrapper>
  );
};

export default HomeScreen;