import { useState } from 'react';
import { BellIcon, BellRingIcon, CreditCardIcon, UserIcon, UserPenIcon, WalletCardsIcon } from 'lucide-react-native';
import { BottomNavigation, Icon, useTheme } from 'react-native-paper';
import NotificationsContent from '@/components/profile/NotificationsContent';
import ProfileContent from '@/components/profile/ProfileContent';
import SubscriptionContent from '@/components/profile/SubscriptionContent';

const ProfileRoute = () => <ProfileContent />;
const NotificationsRoute = () => <NotificationsContent />;
const SubscriptionRoute = () => <SubscriptionContent />;

const ProfileLayout = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'profile',
      title: 'Profile',
      focusedIcon: () => (
        <Icon
          size={20}
          source={({ size, color }: { size: number, color: string }) => (
            <UserPenIcon
              color={color}
              size={size} />
          )} />
      ),
      unfocusedIcon: () => (
        <Icon
          size={20}
          source={({ size, color }: { size: number, color: string }) => (
            <UserIcon
              color={color}
              size={size} />
          )} />
      ),
    },
    {
      key: 'notifications',
      title: 'Notifications',
      focusedIcon: () => (
        <Icon
          size={20}
          source={({ size, color }: { size: number, color: string }) => (
            <BellRingIcon
              color={color}
              size={size} />
          )} />
      ),
      unfocusedIcon: () => (
        <Icon
          size={20}
          source={({ size, color }: { size: number, color: string }) => (
            <BellIcon
              color={color}
              size={size} />
          )} />
      ),
    },
    {
      key: 'subscription',
      title: 'Subscription',
      focusedIcon: () => (
        <Icon
          size={20}
          source={({ size, color }: { size: number, color: string }) => (
            <WalletCardsIcon
              color={color}
              size={size} />
          )} />
      ),
      unfocusedIcon: () => (
        <Icon
          size={20}
          source={({ size, color }: { size: number, color: string }) => (
            <CreditCardIcon
              color={color}
              size={size} />
          )} />
      ),
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    profile: ProfileRoute,
    notifications: NotificationsRoute,
    subscription: SubscriptionRoute,
  });

  const theme = useTheme();
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