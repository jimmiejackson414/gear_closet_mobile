import { Stack, useNavigationContainerRef } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { SupabaseProvider } from '@/context/SupabaseProvider';
import '@/global.css';
import 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const RootLayout = () => {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);

  return (
    <SupabaseProvider>
      <GluestackUIProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(protected)" />
            <Stack.Screen name="(public)" />
          </Stack>
        </SafeAreaProvider>
      </GluestackUIProvider>
    </SupabaseProvider>
  );
};

export default RootLayout;