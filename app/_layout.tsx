import { AppRegistry, LogBox } from 'react-native';
import { Stack, useNavigationContainerRef } from 'expo-router';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from '@react-navigation/native';
import merge from 'deepmerge';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { Colors } from '@/constants/colors';
import { SupabaseProvider } from '@/context/SupabaseProvider';
import { useTheme } from '@/hooks';
import { APIProvider } from '@/services/common/api-provider';
import 'react-native-reanimated';

if (process.env.NODE_ENV === 'production') {
  LogBox.ignoreAllLogs(true);
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

const RootLayout = () => {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);

  const { colorScheme } = useTheme();
  const paperTheme =
      colorScheme === 'dark'
        ? CombinedDarkTheme
        : CombinedDefaultTheme;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClickOutsideProvider>
        <SupabaseProvider>
          <APIProvider>
            <PaperProvider
              settings={{ rippleEffectEnabled: false }}
              theme={paperTheme}>
              <ThemeProvider value={paperTheme}>
                <SafeAreaProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(protected)" />
                    <Stack.Screen name="(public)" />
                  </Stack>
                  <Toaster position="bottom-center" />
                </SafeAreaProvider>
              </ThemeProvider>
            </PaperProvider>
          </APIProvider>
        </SupabaseProvider>
      </ClickOutsideProvider>
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent('RootLayout', () => RootLayout);

export default RootLayout;