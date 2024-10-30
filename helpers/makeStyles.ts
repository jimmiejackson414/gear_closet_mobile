/* eslint-disable no-unused-vars */
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import fullConfig from '@/helpers/theme';
import type { ResolvedConfig } from '@/helpers/theme';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

const makeStyles = <T extends NamedStyles<T>>(styles: (theme: ResolvedConfig['theme'], props: any) => T) => (props?: any) => {
  const theme = fullConfig.theme;

  return useMemo(() => {
    const css = styles(theme, props);
    return StyleSheet.create(css);
  }, [props, theme]);
};

export default makeStyles;