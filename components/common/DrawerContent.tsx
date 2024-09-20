import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useTheme } from 'react-native-paper';
import { useSupabase } from '@/context/SupabaseProvider';

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const router = useRouter();
  const { signOut } = useSupabase();

  const onLogout = async () => {
    await signOut();
    router.replace('/welcome');
  };

  const theme = useTheme();
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
          color={theme.colors.backdrop}
          size={20}
          source={({ size, color }: { size: number, color: string }) => (
            <LogOut
              color={color}
              size={size}
              style={{ marginRight: 20 }} />
          )} />
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
    marginBottom: 36,
  },
  logoutIcon: { marginRight: 32 },
  logoutText: { color: 'rgba(28, 28, 30, 0.68' },
});

export default DrawerContent;