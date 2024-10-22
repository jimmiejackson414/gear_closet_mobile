import { useLayoutEffect } from 'react';
import { Tabs, useNavigation, useSegments } from 'expo-router';
import { Icon } from 'react-native-paper';
import { capitalize } from '@/helpers';
import { useAppTheme } from '@/hooks';

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

  const theme = useAppTheme();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.colors.tertiary,
      tabBarInactiveTintColor: theme.colors.onSurface,
      tabBarItemStyle: {
        borderRadius: 20,
        marginHorizontal: 10,
        padding: 5,
      },
      tabBarStyle: {
        borderTopWidth: 1,
        backgroundColor: theme.colors.onTertiary,
        borderTopColor: 'lightgray',
        paddingVertical: 10,
        height: 95,
      },
      tabBarLabelStyle: { fontWeight: 'bold' },
      tabBarActiveBackgroundColor: theme.colors.tertiaryContainer,
    }}>
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon
              color={color}
              size={size}
              source="account-edit" />
          ),
        }} />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Icon
              color={color}
              size={size}
              source="bell-ring" />
          ),
        }} />
      <Tabs.Screen
        name="subscription"
        options={{
          tabBarLabel: 'Subscription',
          tabBarIcon: ({ color, size }) => (
            <Icon
              color={color}
              size={size}
              source="credit-card" />
          ),
        }} />
    </Tabs>
  );
};

export default ProfileLayout;