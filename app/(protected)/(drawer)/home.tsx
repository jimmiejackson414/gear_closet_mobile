import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
// import ScreenWrapper from '@/components/common/ScreenWrapper';
// import ForumsWidget from '@/components/dashboard/ForumsWidget';
// import FriendsWidget from '@/components/dashboard/FriendsWidget';
// import InvitationsWidget from '@/components/dashboard/InvitationsWidget';
// import UpcomingTripsWidget from '@/components/dashboard/UpcomingTripsWidget';
import { useErrorHandling, useLoading  } from '@/hooks';
import { type ForumResponse, useDashboardQuery } from '@/services/dashboard';
import type { Tables } from '@/types';
import type { ExtendedFriend } from '@/types/helpers';

const HomeScreen = () => {
  const {
    data, error, isLoading,
  } = useDashboardQuery();

  useLoading(isLoading);
  useErrorHandling(error, 'Failed to fetch dashboard data');

  const [friends, setFriends] = useState<ExtendedFriend[]>([]);
  const [trips, setTrips] = useState<Tables<'trips'>[]>([]);
  const [tripFriends, setTripFriends] = useState<Tables<'trip_friends'>[]>([]);
  const [forumsData, setForumsData] = useState<ForumResponse | null>(null);
  useEffect(() => {
    if (data) {
      setFriends(data.friends);
      setTrips(data.trips);
      setTripFriends(data.trip_friends);
      setForumsData(data.forums);
    }
  }, [data]);

  return (
    // <ScreenWrapper>
    <View style={{ gap: 16 }}>
      {/* <UpcomingTripsWidget data={trips} />
        <InvitationsWidget data={tripFriends} />
        <FriendsWidget data={{ friends: [ ...friends ], total: data?.total_friends_count ?? 0 }} />
        <ForumsWidget data={forumsData} /> */}
      <Text>HomeScreen</Text>
    </View>
    // </ScreenWrapper>
  );
};

export default HomeScreen;