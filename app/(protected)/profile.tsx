import { Text, View } from 'react-native';

// import { Button } from "@/components/ui/button";
// import { Text } from "@/components/ui/text";
// import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from '@/context/SupabaseProvider';

export default function TabTwoScreen() {
  const { signOut } = useSupabase();

  return (
    <View>
      <Text>Profile</Text>
      {/* <H1 className="text-center">Sign Out</H1>
			<Muted className="text-center">
				Sign out and return to the welcome screen.
			</Muted>
			<Button
				className="w-full"
				size="default"
				variant="default"
				onPress={() => {
					signOut();
				}}
			>
				<Text>Sign Out</Text>
			</Button> */}
    </View>
  );
}