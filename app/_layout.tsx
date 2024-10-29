import { AppRegistry, LogBox } from 'react-native';
import { Stack, useNavigationContainerRef } from 'expo-router';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { SupabaseProvider } from '@/context/SupabaseProvider';
import { ThemeProvider, useAppTheme } from '@/context/ThemeProvider';
import { APIProvider } from '@/services/common/api-provider';
import 'react-native-reanimated';

if (process.env.NODE_ENV === 'production') {
  LogBox.ignoreAllLogs(true);
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const AppContent = () => {
  const { theme } = useAppTheme();

  return (
    <PaperProvider
      settings={{ rippleEffectEnabled: false }}
      theme={theme}>
      <ActionSheetProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(protected)" />
            <Stack.Screen name="(public)" />
          </Stack>
          <Toaster position="bottom-center" />
        </SafeAreaProvider>
      </ActionSheetProvider>
    </PaperProvider>
  );
};

const RootLayout = () => {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClickOutsideProvider>
        <SupabaseProvider>
          <APIProvider>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </APIProvider>
        </SupabaseProvider>
      </ClickOutsideProvider>
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent('RootLayout', () => RootLayout);

export default RootLayout;