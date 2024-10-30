import { Fragment } from 'react';
import { Pressable, Text } from 'react-native';
import { Link } from 'expo-router';
import { View } from '@rn-primitives/slot';
import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import { Badge, Icon, IconButton } from 'react-native-paper';
import DrawerContent from '@/components/common/DrawerContent';
import { Button } from '@/components/ui/button';
import { Dot } from '@/components/ui/dot';
import { makeStyles } from '@/helpers';
import config from '@/helpers/theme';
import { BellIcon, CircleUserIcon, HomeIcon, ListChecksIcon, TentTreeIcon, UsersIcon } from '@/lib/icons';
// import { useAppTheme } from '@/context/ThemeProvider';
import { useReadNotifications } from '@/services/profile';

const DrawerLayout = () => {
  const { data: unreadNotifications = [] } = useReadNotifications();
  const styles = useStyles();
  const { theme } = config;
  // const { theme } = useAppTheme();

  return (
    <Drawer
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName="home"
      screenOptions={{
        headerShown: true,
        swipeEdgeWidth: 0,
        drawerStyle: { backgroundColor: theme.colors.background },
        headerStyle: {
          // backgroundColor: theme.colors.backgroundGradient[1],
          borderBottomWidth: 0,
          shadowOpacity: 0,
        },
        headerRight: () => (
          <View style={{ marginRight: 16 }}>
            <Button variant="ghost" size="icon">
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
              size={20}
               />
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

const useStyles = makeStyles(theme => ({
  badge: {
    position: 'absolute',
    top: 4,
    right: 12,
    backgroundColor: theme.colors.error,
  },
}));

export default DrawerLayout;