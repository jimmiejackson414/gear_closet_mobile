import { Drawer } from 'expo-router/drawer';
import { Bell, House, NotebookText, TentTree, UserCog, Users } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Box, Button, Icon } from '@/components/ui';
import DrawerContent from '@/components/common/DrawerContent';
import theme from '@/lib/theme';
import useAppStore from '@/stores/appStore';

const DrawerLayout = () => {
  const unreadNotifications = useAppStore((state) => state.unreadNotifications());
  console.log({ unreadNotifications });

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      initialRouteName="home"
      screenOptions={{
        headerShown: true,
        swipeEdgeWidth: 0,
        headerRight: () => (
          <Link
            asChild
            href="/modal">
            <Button
              className="mr-6 relative"
              variant="link">
              <Icon
                as={Bell}
                size="md"
                stroke={theme.colors.gray[500]} />
              {!!unreadNotifications.length && (
                <Box
                  className="absolute top-1 -right-1"
                  style={{
                    backgroundColor: theme.colors.red[500],
                    borderRadius: 999,
                    height: 6,
                    width: 6,
                  }}>
                </Box>
              )}
            </Button>
          </Link>
        ),
      }}>
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Home',
          headerTitle: 'Home',
          drawerIcon: ({ color }) => (
            <Icon
              as={House}
              color={color}
              size={'md'} />
          ),
        }} />
      <Drawer.Screen
        name="closet"
        options={{
          drawerLabel: 'Closet',
          headerTitle: 'Closet',
          drawerIcon: ({ color }) => (
            <Icon
              as={TentTree}
              color={color}
              size={'md'} />
          ),
        }} />
      <Drawer.Screen
        name="friends"
        options={{
          drawerLabel: 'Friends',
          headerTitle: 'Friends',
          drawerIcon: ({ color }) => (
            <Icon
              as={Users}
              color={color}
              size={'md'} />
          ),
        }} />
      <Drawer.Screen
        name="planning"
        options={{
          drawerLabel: 'Planning',
          headerTitle: 'Planning',
          drawerIcon: ({ color }) => (
            <Icon
              as={NotebookText}
              color={color}
              size={'md'} />
          ),
        }} />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profile',
          headerTitle: 'Profile',
          drawerIcon: ({ color }) => (
            <Icon
              as={UserCog}
              color={color}
              size={'md'} />
          ),
        }} />
    </Drawer>
  );
};

export default DrawerLayout;