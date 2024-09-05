import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import theme from '@/lib/theme';


const Layout = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Drawer
      initialRouteName="home"
      screenOptions={{ drawerActiveBackgroundColor: theme.colors.secondary[500] }}>
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
        name="friends"
        options={{
          headerShown: true,
          drawerLabel: 'Friends',
          headerTitle: 'Friends',
          headerStyle: { backgroundColor: theme.colors.primary[500] },
        }} />
      <Drawer.Screen
        name="planning"
        options={{
          headerShown: true,
          drawerLabel: 'Planning',
          headerTitle: 'Planning',
          headerStyle: { backgroundColor: theme.colors.primary[500] },
        }} />
      <Drawer.Screen
        name="profile"
        options={{
          headerShown: true,
          drawerLabel: 'Profile',
          headerTitle: 'Profile',
          headerStyle: { backgroundColor: theme.colors.primary[500] },
          title: 'What',
        }} />
    </Drawer>
  </GestureHandlerRootView>
);

export default Layout;