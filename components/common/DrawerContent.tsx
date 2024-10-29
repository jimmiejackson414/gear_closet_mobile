import { Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Icon, Switch } from 'react-native-paper';
import { useSupabase } from '@/context/SupabaseProvider';
import { useAppTheme } from '@/context/ThemeProvider';
import { makeStyles } from '@/helpers';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';

const DrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { signOut } = useSupabase();

  const { colorScheme, toggleTheme } = useAppTheme();
  const styles = useStyles();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
      key="drawer-content-scroll-view">
      <DrawerItemList {...props} />
      <View style={styles.themeToggle}>
        <Switch
          onValueChange={toggleTheme}
          value={colorScheme === 'dark'} />
        <Text style={styles.toggleText}>
          Dark Mode
        </Text>
      </View>
      <View style={styles.flexSpace} />
      <TouchableOpacity
        onPress={signOut}
        style={styles.logoutButton}>
        <Icon
          color={'rgba(28,28,30,0.68)'}
          size={20}
          source="logout" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  flexSpace: { flex: 1 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 32,
    marginBottom: 36,
  },
  logoutText: { color: 'rgba(28, 28, 30, 0.68)' },
  themeToggle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    marginBottom: 24,
  },
  toggleText: {
    color: 'rgba(28, 28, 30, 0.68)',
    fontWeight: '500',
  },
}));

export default DrawerContent;