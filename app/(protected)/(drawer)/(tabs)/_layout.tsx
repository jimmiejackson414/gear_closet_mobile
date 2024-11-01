import { useLayoutEffect } from 'react';
import {
  Tabs, useNavigation, useSegments,
} from 'expo-router';
import { capitalize } from '@/helpers';
import { useTheme } from '@/hooks';
import {
  BellIcon, CreditCardIcon, UserPenIcon,
} from '@/lib/icons';

const ProfileLayout = () => {
  const navigation = useNavigation();
  const segments = useSegments();

  // dynamically update header title based on the selected tab
  useLayoutEffect(() => {
    if (segments.length > 0) {
      const activeSegment = segments[segments.length - 1];
      const headerTitle = capitalize(activeSegment);
      if (headerTitle && headerTitle !== '(tabs)') {
        navigation.setOptions({ headerTitle });
      }
    }
  }, [segments, navigation]);

  const theme = useTheme();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.accentAlt,
      tabBarInactiveTintColor: theme.text,
      tabBarItemStyle: {
        borderRadius: 20,
        marginHorizontal: 10,
        padding: 5,
      },
      tabBarStyle: {
        borderTopWidth: 1,
        backgroundColor: theme.background,
        borderTopColor: 'lightgray',
        paddingVertical: 10,
        height: 95,
      },
      tabBarLabelStyle: { fontWeight: 'bold' },
      tabBarActiveBackgroundColor: theme.accent,
    }}>
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({
            color, focused, size,
          }) => (
            <UserPenIcon
              className={focused ? 'fill-accent-alt' : 'stroke-muted-foreground'}
              color={color}
              size={size} />
          ),
        }} />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({
            color, focused, size,
          }) => (
            <BellIcon
              className={focused ? 'fill-accent-alt' : 'stroke-muted-foreground'}
              color={color}
              size={size} />
          ),
        }} />
      <Tabs.Screen
        name="subscription"
        options={{
          tabBarLabel: 'Subscription',
          tabBarIcon: ({
            color, focused, size,
          }) => (
            <CreditCardIcon
              className={focused ? 'fill-accent-alt' : 'stroke-muted-foreground'}
              color={color}
              size={size} />
          ),
        }} />
    </Tabs>
  );
};

export default ProfileLayout;