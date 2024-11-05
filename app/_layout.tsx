import '@/global.css';

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';
import { SupabaseProvider } from '@/context/SupabaseProvider';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
import { CUSTOM_THEME } from '@/lib/constants';
import { useColorScheme } from '@/lib/useColorScheme';
import { APIProvider } from '@/services/common/api-provider';
import type { Theme } from '@react-navigation/native';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: CUSTOM_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: CUSTOM_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const {
    colorScheme, setColorScheme, isDarkColorScheme,
  } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
      }
      if (!theme) {
        AsyncStorage.setItem('theme', colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === 'dark' ? 'dark' : 'light';
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })()
      .finally(() => {
        SplashScreen.hideAsync();
      });
  });

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClickOutsideProvider>
        <ActionSheetProvider>
          <SupabaseProvider>
            <APIProvider>
              <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
                <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(public)" />
                  <Stack.Screen name="(protected)" />
                </Stack>
                <Toaster position="bottom-center" />
                <PortalHost />
              </ThemeProvider>
            </APIProvider>
          </SupabaseProvider>
        </ActionSheetProvider>
      </ClickOutsideProvider>
    </GestureHandlerRootView>
  );
}
