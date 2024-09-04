import { Drawer } from 'expo-router/drawer';
import theme from '@/lib/theme';

const Layout = () => {
  return (
    // <Drawer
    //   screenOptions={{
    //     headerStyle: {
    //       backgroundColor: Colors.background,
    //     },
    //     headerTintColor: '#fff',
    //     drawerActiveBackgroundColor: Colors.primary,
    //     drawerActiveTintColor: '#fff',
    //   }}>
    <Drawer initialRouteName="home">
      <Drawer.Screen
        name="home"
        options={{
          headerShown: true,
          drawerLabel: 'Home',
          headerTitle: 'Home',
          headerStyle: { backgroundColor: theme.colors.primary[500] },
        }} />
      <Drawer.Screen
        name="closet"
        options={{
          headerShown: true,
          drawerLabel: 'Closet',
          headerTitle: 'Closet',
          headerStyle: { backgroundColor: theme.colors.primary[500] },
        }} />
      <Drawer.Screen
        name="profile"
        options={{
          headerShown: true,
          drawerLabel: 'Profile',
          headerTitle: 'Profile',
          headerStyle: { backgroundColor: theme.colors.primary[500] },
          // title: 'Profile'
        }} />
    </Drawer>
  );
};

export default Layout;