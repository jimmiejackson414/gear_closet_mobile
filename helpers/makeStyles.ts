/* eslint-disable no-unused-vars */
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeProvider';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { MD3Theme } from 'react-native-paper';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

const makeStyles = <T extends NamedStyles<T>>(styles: (theme: MD3Theme, props: any) => T) => (props?: any) => {
  const { theme } = useAppTheme();

  return useMemo(() => {
    const css = styles(theme, props);
    return StyleSheet.create(css);
  }, [props, theme]);
};

export default makeStyles;