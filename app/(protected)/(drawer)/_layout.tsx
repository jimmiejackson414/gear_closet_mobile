import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Badge, Icon, IconButton } from 'react-native-paper';
import DrawerContent from '@/components/common/DrawerContent';
import { makeStyles } from '@/helpers';
import { useAppTheme } from '@/hooks';
import { useReadNotifications } from '@/services/profile';

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
              <IconButton
                icon="bell"
                iconColor={theme.colors.secondary} />
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
              source="home" />
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
              source="tent" />
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
              source="format-list-bulleted" />
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
              source="account-group" />
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
              source="account-circle" />
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