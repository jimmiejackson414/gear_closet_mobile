import { Tabs } from 'expo-router';
import { BellRing, CreditCard, UserPen } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

const ProfileLayout = () => (
  <Tabs screenOptions={{ headerShown: false  }}>
    <Tabs.Screen
      name="profile"
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Icon
            color={color}
            size={size}
            source={{ uri: UserPen }} />
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
            source={{ uri: BellRing }} />
        ),
      }} />
    <Tabs.Screen
      name="billing"
      options={{
        tabBarLabel: 'Billing',
        tabBarIcon: ({ color, size }) => (
          <Icon
            color={color}
            size={size}
            source={{ uri: CreditCard }} />
        ),
      }} />
  </Tabs>
);

export default ProfileLayout;