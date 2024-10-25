import { Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Icon, Switch } from 'react-native-paper';
import { useSupabase } from '@/context/SupabaseProvider';
import { makeStyles } from '@/helpers';
import useAppTheme from '@/hooks/useAppTheme';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';

const DrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { signOut } = useSupabase();

  const {
    theme, colorScheme, toggleTheme,
  } = useAppTheme();
  const styles = useStyles(theme);

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
          color={theme.colors.onBackground}
          size={20}
          source="logout" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const useStyles = makeStyles(theme => ({
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
  logoutText: { color: theme.colors.onBackground },
  themeToggle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    marginBottom: 24,
  },
  toggleText: {
    color: theme.colors.onBackground,
    fontWeight: '500',
  },
}));

export default DrawerContent;