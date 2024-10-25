import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks';
import type { ViewProps } from 'react-native';

const GradientBackground: React.FC<ViewProps> = ({
  children, style, ...props
}) => {
  const { theme } = useAppTheme();
  const colors = theme.colors.backgroundGradient;

  return (
    <LinearGradient
      colors={colors}
      end={[0, 0]}
      start={[0, 1]}
      style={[{ flex: 1 }, style]}
      {...props}>
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;