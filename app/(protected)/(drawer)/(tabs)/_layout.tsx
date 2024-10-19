import { useLayoutEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { BottomNavigation, Icon } from 'react-native-paper';
import NotificationsContent from '@/components/profile/NotificationsContent';
import ProfileContent from '@/components/profile/ProfileContent';
import SubscriptionContent from '@/components/profile/SubscriptionContent';
import { useAppTheme } from '@/hooks';

const ProfileRoute = () => <ProfileContent />;
const NotificationsRoute = () => <NotificationsContent />;
const SubscriptionRoute = () => <SubscriptionContent />;

const ProfileLayout = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {
      key: 'profile',
      title: 'Profile',
      focusedIcon: () => (
        <Icon
          size={24}
          source="account-edit" />
      ),
      unfocusedIcon: () => (
        <Icon
          size={24}
          source="account-edit-outline" />
      ),
    },
    {
      key: 'notifications',
      title: 'Notifications',
      focusedIcon: () => (
        <Icon
          size={24}
          source="bell-ring" />
      ),
      unfocusedIcon: () => (
        <Icon
          size={24}
          source="bell-ring-outline" />
      ),
    },
    {
      key: 'subscription',
      title: 'Subscription',
      focusedIcon: () => (
        <Icon
          size={24}
          source="credit-card" />
      ),
      unfocusedIcon: () => (
        <Icon
          size={24}
          source="credit-card-outline" />
      ),
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    profile: ProfileRoute,
    notifications: NotificationsRoute,
    subscription: SubscriptionRoute,
  });

  // dynamically update header title based on the selected tab
  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: routes[index].title });
  }, [index, navigation, routes]);

  const theme = useAppTheme();
  return (
    <BottomNavigation
      activeColor={theme.colors.tertiary}
      activeIndicatorStyle={{ backgroundColor: theme.colors.tertiaryContainer }}
      barStyle={{
        backgroundColor: 'white', borderTopWidth: 1, borderTopColor: 'lightgray',
      }}
      compact={true}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationType='opacity' />
  );
};

export default ProfileLayout;