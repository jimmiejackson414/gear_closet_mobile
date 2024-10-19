import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Icon } from 'react-native-paper';
import { useSupabase } from '@/context/SupabaseProvider';
import { useAppTheme } from '@/hooks';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';

const DrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const router = useRouter();
  const { signOut } = useSupabase();

  const onLogout = async () => {
    await signOut();
    router.replace('/welcome');
  };

  const theme = useAppTheme();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
      key="drawer-content-scroll-view">
      <DrawerItemList {...props} />
      <View style={styles.flexSpace} />
      <TouchableOpacity
        onPress={onLogout}
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

const styles = StyleSheet.create({
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
  logoutText: { color: 'rgba(28, 27, 31, 0.68' },
});

export default DrawerContent;