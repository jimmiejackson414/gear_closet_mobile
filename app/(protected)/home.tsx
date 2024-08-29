import { useRouter } from 'expo-router';
import { Text } from 'react-native';
// import { Button } from 'react-native-paper';
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
      {/* <Button
        mode='contained'
        onPress={onLogout}>
        Sign Out
      </Button> */}
      {/* <H1 className="text-center">Home</H1>
			<Muted className="text-center">
				You are now authenticated and this session will persist even after
				closing the app.
			</Muted>
			<Button
				className="w-full"
				variant="default"
				size="default"
				onPress={() => {
					router.push("/modal");
				}}
			>
				<Text>Open Modal</Text>
			</Button> */}
    </ScreenWrapper>
  );
}