import { useLayoutEffect } from 'react';
import { Text } from 'react-native';
import { Tabs, useNavigation, useSegments } from 'expo-router';
// import { Icon } from 'react-native-paper';
// import { useAppTheme } from '@/context/ThemeProvider';
import { capitalize } from '@/helpers';

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

  // const { theme } = useAppTheme();
  return (
    <Text>ProfileLayout</Text>
    // <Tabs screenOptions={{
    //   headerShown: false,
    //   tabBarActiveTintColor: theme.colors.tertiary,
    //   tabBarInactiveTintColor: theme.colors.onSurface,
    //   tabBarItemStyle: {
    //     borderRadius: 20,
    //     marginHorizontal: 10,
    //     padding: 5,
    //   },
    //   tabBarStyle: {
    //     borderTopWidth: 1,
    //     backgroundColor: theme.colors.onTertiary,
    //     borderTopColor: 'lightgray',
    //     paddingVertical: 10,
    //     height: 95,
    //   },
    //   tabBarLabelStyle: { fontWeight: 'bold' },
    //   tabBarActiveBackgroundColor: theme.colors.tertiaryContainer,
    // }}>
    //   <Tabs.Screen
    //     name="profile"
    //     options={{
    //       tabBarLabel: 'Profile',
    //       tabBarIcon: ({
    //         color, focused, size,
    //       }) => (
    //         <Icon
    //           color={color}
    //           size={size}
    //           source={ focused ? 'account-edit' : 'account-edit-outline' } />
    //       ),
    //     }} />
    //   <Tabs.Screen
    //     name="notifications"
    //     options={{
    //       tabBarLabel: 'Notifications',
    //       tabBarIcon: ({
    //         color, focused, size,
    //       }) => (
    //         <Icon
    //           color={color}
    //           size={size}
    //           source={ focused ? 'bell-ring' : 'bell-ring-outline' } />
    //       ),
    //     }} />
    //   <Tabs.Screen
    //     name="subscription"
    //     options={{
    //       tabBarLabel: 'Subscription',
    //       tabBarIcon: ({
    //         color, focused, size,
    //       }) => (
    //         <Icon
    //           color={color}
    //           size={size}
    //           source={ focused ? 'credit-card' : 'credit-card-outline' } />
    //       ),
    //     }} />
    // </Tabs>
  );
};

export default ProfileLayout;