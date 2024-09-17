import { Tabs } from 'expo-router';
import { BellRing, CreditCard, UserPen } from 'lucide-react-native';
import { Icon } from '@/components/ui';

const ProfileLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false  }}>
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Icon
              as={UserPen}
              color={color} />
          ),
        }} />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color }) => (
            <Icon
              as={BellRing}
              color={color} />
          ),
        }} />
      <Tabs.Screen
        name="billing"
        options={{
          tabBarLabel: 'Billing',
          tabBarIcon: ({ color }) => (
            <Icon
              as={CreditCard}
              color={color} />
          ),
        }} />
    </Tabs>
  );
};

export default ProfileLayout;