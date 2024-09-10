import { Drawer } from 'expo-router/drawer';
import { House, NotebookText, TentTree, UserCog, Users } from 'lucide-react-native';
import { Icon } from '@/components/ui';
import DrawerContent from '@/components/common/DrawerContent';

const Layout = () => (
  <Drawer
    drawerContent={(props) => <DrawerContent {...props} />}
    initialRouteName="home"
    screenOptions={{ headerShown: true, swipeEdgeWidth: 0 }}>
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

export default Layout;