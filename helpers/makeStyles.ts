import { useMemo } from 'react';
import { MD3Theme, useTheme } from 'react-native-paper';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

const makeStyles = <T extends NamedStyles<T>>(styles: (theme: MD3Theme, props: any) => T) => (props?: any) => {
  const theme = useTheme();

  return useMemo(() => {
    const css = styles(theme, props);
    return StyleSheet.create(css);
  }, [props, theme]);
};

export default makeStyles;