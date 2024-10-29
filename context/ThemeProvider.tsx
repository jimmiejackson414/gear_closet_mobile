import { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import merge from 'deepmerge';
import { adaptNavigationTheme } from 'react-native-paper';
import { customDarkTheme, customLightTheme } from '@/constants/colors';
import type { ReactNode } from 'react';
import type { ColorSchemeName } from 'react-native';

export type AppTheme = typeof customLightTheme;

interface ThemeContextProps {
  theme: AppTheme;
  colorScheme: ColorSchemeName;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const THEME_PREFERENCE_KEY = 'theme_preference';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const [localColorScheme, setLocalColorScheme] = useState<ColorSchemeName>(systemColorScheme || 'light');

  useEffect(() => {
    const loadThemePreference = async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
      if (savedTheme) {
        setLocalColorScheme(savedTheme as ColorSchemeName);
      }
    };

    loadThemePreference();

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

  const toggleTheme = async () => {
    const newScheme = localColorScheme === 'light' ? 'dark' : 'light';
    setLocalColorScheme(newScheme);
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newScheme);
    router.setParams({ colorScheme: newScheme });
  };

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = merge(LightTheme, customLightTheme);
  const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

  const theme: AppTheme = localColorScheme === 'light' ? CombinedDefaultTheme : CombinedDarkTheme;

  return (
    <ThemeContext.Provider value={{
      theme, colorScheme: localColorScheme, toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};