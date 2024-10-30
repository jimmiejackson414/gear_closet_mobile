import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { CUSTOM_THEME } from '@/lib/constants';

export async function setAndroidNavigationBar(theme: 'light' | 'dark') {
  if (Platform.OS !== 'android') return;
  await NavigationBar.setButtonStyleAsync(theme === 'dark' ? 'light' : 'dark');
  await NavigationBar.setBackgroundColorAsync(
    theme === 'dark' ? CUSTOM_THEME.dark.background : CUSTOM_THEME.light.background,
  );
}
