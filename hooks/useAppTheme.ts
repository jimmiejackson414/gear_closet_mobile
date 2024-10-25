import { useEffect, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import merge from 'deepmerge';
import { adaptNavigationTheme } from 'react-native-paper';
import { customDarkTheme, customLightTheme } from '@/constants/colors';
import type { ColorSchemeName } from 'react-native';

export type AppTheme = typeof customLightTheme;

const useAppTheme = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [localColorScheme, setLocalColorScheme] = useState<ColorSchemeName>(colorScheme || 'light');

  useEffect(() => {
    const listener = (preferences: { colorScheme: ColorSchemeName }) => {
      const { colorScheme } = preferences;
      if (colorScheme) {
        setLocalColorScheme(colorScheme);
      }
    };

    const subscription = Appearance.addChangeListener(listener);

    return () => {
      subscription.remove();
    };
  }, []);

  const toggleTheme = () => {
    const newScheme = localColorScheme === 'light' ? 'dark' : 'light';
    setLocalColorScheme(newScheme);
    router.setParams({ colorScheme: newScheme });
  };

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = merge(LightTheme, customLightTheme);
  const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

  const theme: AppTheme = localColorScheme === 'light' ? CombinedDefaultTheme : CombinedDarkTheme;

  return {
    theme,
    colorScheme: localColorScheme,
    toggleTheme,
  };
};

export default useAppTheme;