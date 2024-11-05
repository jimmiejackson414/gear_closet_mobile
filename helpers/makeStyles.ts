import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import useTheme from '@/hooks/useTheme';
import type { Theme } from '@/hooks/useTheme';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

const makeStyles = <T extends NamedStyles<T>>(styles: (theme: Theme, props: any) => T) => (props?: any) => {
  const theme = useTheme();

  return useMemo(() => {
    const css = styles(theme, props);
    return StyleSheet.create(css);
  }, [props, theme]);
};

export default makeStyles;