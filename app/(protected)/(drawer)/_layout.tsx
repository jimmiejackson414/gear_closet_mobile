import { View } from '@rn-primitives/slot';
import { Drawer } from 'expo-router/drawer';
import DrawerContent from '@/components/common/DrawerContent';
import {
  Button, Dot,
} from '@/components/ui';
import { useTheme } from '@/hooks';
import {
  BellIcon, CircleUserIcon, HomeIcon, ListChecksIcon, TentTreeIcon, UsersIcon,
} from '@/lib/icons';
import { useReadNotifications } from '@/services/profile';

const DrawerLayout = () => {
  const { data: unreadNotifications = [] } = useReadNotifications();
  const theme = useTheme();

  return (
    <Drawer
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName="home"
      screenOptions={{
        headerShown: true,
        swipeEdgeWidth: 0,
        drawerStyle: { backgroundColor: theme.background },
        headerStyle: {
          backgroundColor: theme.background,
          borderBottomWidth: 0,
          shadowOpacity: 0,
        },
        headerRight: () => (
          <View style={{ marginRight: 16 }}>
            <Button
              size="icon"
              variant="ghost">
              <BellIcon />
              {!!unreadNotifications.length ? <Dot /> : null}
            </Button>
          </View>
        ),
      }}>
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Home',
          headerTitle: 'Home',
          drawerIcon: ({ color }) => (
            <HomeIcon
              color={color}
              size={20} />
          ),
        }} />
      <Drawer.Screen
        name="closet"
        options={{
          drawerLabel: 'Closet',
          headerTitle: 'Closet',
          drawerIcon: ({ color }) => (
            <TentTreeIcon
              color={color}
              size={20} />
          ),
        }} />
      <Drawer.Screen
        name="planning"
        options={{
          drawerLabel: 'Planning',
          headerTitle: 'Planning',
          drawerIcon: ({ color }) => (
            <ListChecksIcon
              color={color}
              size={20} />
          ),
        }} />
      <Drawer.Screen
        name="friends"
        options={{
          drawerLabel: 'Friends',
          headerTitle: 'Friends',
          drawerIcon: ({ color }) => (
            <UsersIcon
              color={color}
              size={20} />
          ),
        }} />
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Profile',
          headerTitle: 'Profile',
          drawerIcon: ({ color }) => (
            <CircleUserIcon
              color={color}
              size={20} />
          ),
        }} />
    </Drawer>
  );
};

export default DrawerLayout;