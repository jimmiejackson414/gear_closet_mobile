import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SupabaseProvider } from '@/context/SupabaseProvider';
import { PaperProvider } from 'react-native-paper';
import theme from '@/lib/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  return (
    <SupabaseProvider>
      <PaperProvider
        theme={theme}
        settings={{ rippleEffectEnabled: false }}>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="(protected)" />
            <Stack.Screen name="(public)" />
            <Stack.Screen
              name="modal"
              options={{
                presentation: 'modal',
              }} />
          </Stack>
        </SafeAreaProvider>
      </PaperProvider>
    </SupabaseProvider>
  );
}