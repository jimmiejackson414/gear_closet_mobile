import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { BellIcon, House, NotebookText, TentTree, UserCog, Users } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Badge, Icon, IconButton } from 'react-native-paper';
import DrawerContent from '@/components/common/DrawerContent';
import { makeStyles } from '@/helpers';
import { useAppTheme } from '@/hooks';
import { useReadNotifications } from '@/services/profile';
import type { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';

const DrawerLayout = () => {
  const { data: unreadNotifications = [] } = useReadNotifications();
  const styles = useStyles();
  const theme = useAppTheme();

  return (
    <Drawer
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName="home"
      screenOptions={{
        headerShown: true,
        swipeEdgeWidth: 0,
        drawerStyle: { backgroundColor: theme.colors.background },
        headerStyle: { backgroundColor: theme.colors.onPrimary },
        headerRight: () => (
          <Link
            asChild
            href="/modal">
            <TouchableOpacity style={{
              marginHorizontal: 8, flexDirection: 'row', alignItems: 'center',
            }}>
              <IconButton icon={({ size }) => (
                <BellIcon
                  color={theme.colors.secondary}
                  size={size} />
              )} />
              <Badge
                size={8}
                style={styles.badge}
                visible={!!unreadNotifications.length} />
            </TouchableOpacity>
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
              color={color}
              size={20}
              source={({ size, color }: IconProps) => (
                <House
                  color={color}
                  size={size} />
              )} />
          ),
        }} />
      <Drawer.Screen
        name="closet"
        options={{
          drawerLabel: 'Closet',
          headerTitle: 'Closet',
          drawerIcon: ({ color }) => (
            <Icon
              color={color}
              size={20}
              source={({ size, color }: IconProps) => (
                <TentTree
                  color={color}
                  size={size} />
              )} />
          ),
        }} />
      <Drawer.Screen
        name="friends"
        options={{
          drawerLabel: 'Friends',
          headerTitle: 'Friends',
          drawerIcon: ({ color }) => (
            <Icon
              color={color}
              size={20}
              source={({ size, color }: IconProps) => (
                <Users
                  color={color}
                  size={size} />
              )} />
          ),
        }} />
      <Drawer.Screen
        name="planning"
        options={{
          drawerLabel: 'Planning',
          headerTitle: 'Planning',
          drawerIcon: ({ color }) => (
            <Icon
              color={color}
              size={20}
              source={({ size, color }: IconProps) => (
                <NotebookText
                  color={color}
                  size={size} />
              )} />
          ),
        }} />
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Profile',
          headerTitle: 'Profile',
          drawerIcon: ({ color }) => (
            <Icon
              color={color}
              size={20}
              source={({ size, color }: IconProps) => (
                <UserCog
                  color={color}
                  size={size} />
              )} />
          ),
        }} />
    </Drawer>
  );
};

const useStyles = makeStyles(theme => ({
  badge: {
    position: 'absolute',
    top: 4,
    right: 12,
    backgroundColor: theme.colors.error,
  },
}));

export default DrawerLayout;