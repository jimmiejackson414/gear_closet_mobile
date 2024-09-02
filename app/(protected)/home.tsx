import { useRouter } from 'expo-router';
import { Text } from 'react-native';
import { Button, ButtonText } from '@/components/ui';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { useSupabase } from '@/context/SupabaseProvider';

export default function TabOneScreen() {
  const router = useRouter();
  const { signOut } = useSupabase();

  const onLogout = async () => {
    await signOut();
    router.replace('/welcome');
  };

  return (
    <ScreenWrapper>
      <Text>Home</Text>
      <Button
        action='primary'
        onPress={onLogout}
        size="lg"
        variant="solid">
        <ButtonText>Sign Out</ButtonText>
      </Button>
    </ScreenWrapper>
  );
}