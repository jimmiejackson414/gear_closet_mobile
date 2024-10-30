import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useSupabase } from '@/context/SupabaseProvider';
import { LogOutIcon, MoonStarIcon, SunIcon } from '@/lib/icons';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import config from '@/helpers/theme';
import { useColorScheme } from '@/lib/useColorScheme';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { signOut } = useSupabase();
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  const handleThemeToggle = () => {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  }

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
      key="drawer-content-scroll-view">
      <DrawerItemList {...props} />
      <DrawerItem
        label="Toggle Theme"
        onPress={handleThemeToggle}
        icon={({ size, color }) => isDarkColorScheme ? <MoonStarIcon size={size} color={color} /> : <SunIcon size={size} color={color} />} />
      <View style={styles.flexSpace} />
      <DrawerItem
        onPress={signOut}
        label="Logout"
        icon={({ size, color }) => <LogOutIcon size={size} color={color} />} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  flexSpace: { flex: 1 },
});

export default DrawerContent;