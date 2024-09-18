import { AppRegistry, LogBox, useColorScheme } from 'react-native';
import { Stack, useNavigationContainerRef } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { Toaster } from 'sonner-native';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SupabaseProvider } from '@/context/SupabaseProvider';
import { APIProvider } from '@/services/common/api-provider';
import { darkTheme, lightTheme } from '@/theme';
import 'react-native-reanimated';

if (process.env.NODE_ENV === 'production') {
  LogBox.ignoreAllLogs(true);
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const RootLayout = () => {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);

  const colorScheme = useColorScheme();

  const paperTheme =
      colorScheme === 'dark'
        ? darkTheme
        : lightTheme;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClickOutsideProvider>
        <SupabaseProvider>
          <APIProvider>
            <PaperProvider
              settings={{ rippleEffectEnabled: false }}
              theme={paperTheme}>
              <SafeAreaProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(protected)" />
                  <Stack.Screen name="(public)" />
                </Stack>
                <Toaster position="bottom-center" />
              </SafeAreaProvider>
            </PaperProvider>
          </APIProvider>
        </SupabaseProvider>
      </ClickOutsideProvider>
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent('RootLayout', () => RootLayout);

export default RootLayout;