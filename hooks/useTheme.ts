import { useColorScheme } from 'react-native';
import { CUSTOM_THEME } from '@/lib/constants';

export type Theme = typeof CUSTOM_THEME.light | typeof CUSTOM_THEME.dark;

const useTheme = (): Theme => {
  const colorScheme = useColorScheme() ?? 'light';
  return CUSTOM_THEME[colorScheme];
};

export default useTheme;