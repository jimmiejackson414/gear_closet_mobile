import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { useRouter } from 'expo-router';
import { customDarkTheme, customLightTheme } from '@/constants/colors';
import type { ColorSchemeName } from 'react-native';

export type AppTheme = typeof customLightTheme;

const useTheme = () => {
  const router = useRouter();
  const [localColorScheme, setLocalColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme() || 'light');

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

  const theme: AppTheme = localColorScheme === 'light' ? customLightTheme : customDarkTheme;

  return {
    theme,
    colorScheme: localColorScheme,
    toggleTheme,
  };
};

export default useTheme;