import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { useRouter } from 'expo-router';
import type { ColorSchemeName } from 'react-native';

const useTheme = () => {
  const router = useRouter();
  const [localColorScheme, setLocalColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme() || 'dark');

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

  return { toggleTheme, colorScheme: localColorScheme };
};

export default useTheme;