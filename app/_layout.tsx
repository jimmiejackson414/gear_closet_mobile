import { Stack } from 'expo-router';
import '@/global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { SupabaseProvider } from '@/context/SupabaseProvider';
import 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const RootLayout = () => (
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

export default RootLayout;