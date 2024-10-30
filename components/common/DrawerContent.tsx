import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Separator } from '@/components/ui/separator';
import { useSupabase } from '@/context/SupabaseProvider';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
import { LogOutIcon, MoonStarIcon, SunIcon } from '@/lib/icons';
import { useColorScheme } from '@/lib/useColorScheme';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';

const DrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { signOut } = useSupabase();
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  const handleThemeToggle = () => {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
      key="drawer-content-scroll-view">
      <DrawerItemList {...props} />
      <Separator />
      <DrawerItem
        icon={({ size, color }) => {
          return isDarkColorScheme ?
            <MoonStarIcon
              color={color}
              size={size} /> :
            <SunIcon
              color={color}
              size={size} />;
        }}
        label="Toggle Theme"
        onPress={handleThemeToggle} />
      <View style={styles.flexSpace} />
      <DrawerItem
        icon={({ size, color }) => <LogOutIcon
          color={color}
          size={size} />}
        label="Logout"
        onPress={signOut} />
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