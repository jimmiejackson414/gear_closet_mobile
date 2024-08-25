import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(0, 98, 161)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(208, 228, 255)',
    onPrimaryContainer: 'rgb(0, 29, 53)',
    secondary: 'rgb(0, 110, 34)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(114, 254, 127)',
    onSecondaryContainer: 'rgb(0, 33, 5)',
    tertiary: 'rgb(172, 50, 49)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(255, 218, 215)',
    onTertiaryContainer: 'rgb(65, 0, 4)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(253, 252, 255)',
    onBackground: 'rgb(26, 28, 30)',
    surface: 'rgb(253, 252, 255)',
    onSurface: 'rgb(26, 28, 30)',
    surfaceVariant: 'rgb(223, 227, 235)',
    onSurfaceVariant: 'rgb(66, 71, 78)',
    outline: 'rgb(115, 119, 127)',
    outlineVariant: 'rgb(194, 199, 207)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(47, 48, 51)',
    inverseOnSurface: 'rgb(241, 240, 244)',
    inversePrimary: 'rgb(156, 202, 255)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(240, 244, 250)',
      level2: 'rgb(233, 240, 248)',
      level3: 'rgb(225, 235, 245)',
      level4: 'rgb(223, 234, 244)',
      level5: 'rgb(218, 230, 242)'
    },
    surfaceDisabled: 'rgba(26, 28, 30, 0.12)',
    onSurfaceDisabled: 'rgba(26, 28, 30, 0.38)',
    backdrop: 'rgba(44, 49, 55, 0.4)'
  },
};

export default theme;