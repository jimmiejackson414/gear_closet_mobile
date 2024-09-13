import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useSupabase } from '@/context/SupabaseProvider';
import { Icon } from '@/components/ui';

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const router = useRouter();
  const { signOut } = useSupabase();

  const onLogout = async () => {
    await signOut();
    router.replace('/welcome');
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}>
      <DrawerItemList {...props} />
      <View style={styles.flexSpace} />
      <TouchableOpacity
        onPress={onLogout}
        style={styles.logoutButton}>
        <Icon
          as={LogOut}
          color="#000"
          size="md"
          style={styles.logoutIcon} />
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