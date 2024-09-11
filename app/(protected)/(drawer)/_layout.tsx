import { Drawer } from 'expo-router/drawer';
import { Bell, House, NotebookText, TentTree, UserCog, Users } from 'lucide-react-native';
import { Link, Stack } from 'expo-router';
import { Button, Icon } from '@/components/ui';
import DrawerContent from '@/components/common/DrawerContent';
import theme from '@/lib/theme';

const DrawerNavigator = () => (
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
            className="mr-6"
            variant="link">
            <Icon
              as={Bell}
              size="md"
              stroke={theme.colors.gray[500]} />
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

const DrawerLayout = () => (
  <Stack>
    {/* <Stack.Screen
      name="home"
      options={{ headerShown: false  }} /> */}
    <Stack.Screen
      name="modal"
      options={{ headerShown: false, presentation: 'modal' }} />
  </Stack>
);

export default DrawerLayout;