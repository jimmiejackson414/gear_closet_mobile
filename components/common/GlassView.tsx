import { View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import {
  type VariantProps, cva,
} from 'class-variance-authority';
import { useTheme } from '@/hooks';
import { cn } from '@/lib/utils';

const glassVariants = cva(
  'relative overflow-hidden rounded-lg',
  {
    variants: {
      blur: {
        light: 'backdrop-blur-sm',
        medium: 'backdrop-blur-md',
        heavy: 'backdrop-blur-lg',
      },
      border: {
        none: '',
        light: 'border border-white/30',
        medium: 'border border-white/50',
        heavy: 'border border-white/70',
      },
    },
    defaultVariants: {
      blur: 'medium',
      border: 'light',
    },
  },
);

type GlassViewProps = VariantProps<typeof glassVariants> & {
  className?: string;
  children?: React.ReactNode;
};

const GlassView: React.FC<GlassViewProps> = ({
  className, blur, border, children, ...props
}) => {
  const theme = useTheme();

  return (
    <View
      className={cn('relative overflow-hidden rounded-lg', className)}
      {...props}>
      <BlurView
        blurAmount={10}
        blurType="light"
        reducedTransparencyFallbackColor={theme.background}
        style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,
        }} />
      <View className={cn(glassVariants({ blur, border }))}>
        {children}
      </View>
    </View>
  );
};

export {
  GlassView, glassVariants,
};
export type { GlassViewProps };