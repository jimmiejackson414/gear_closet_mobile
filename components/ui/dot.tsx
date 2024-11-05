import { View } from 'react-native';
import * as Slot from '@rn-primitives/slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { SlottableViewProps } from '@rn-primitives/types';

const dotVariants = cva(
  'absolute h-2 w-2 rounded-full',
  {
    variants: {
      position: {
        'top-left': 'top-0 left-0',
        'top-right': 'top-0 right-0',
        'bottom-left': 'bottom-0 left-0',
        'bottom-right': 'bottom-0 right-0',
      },
      variant: {
        default: 'bg-primary',
        destructive: 'bg-destructive',
        secondary: 'bg-secondary',
        accent: 'bg-accent',
      },
    },
    defaultVariants: {
      position: 'top-right',
      variant: 'destructive',
    },
  },
);

type DotProps = SlottableViewProps & VariantProps<typeof dotVariants>;

function Dot({
  className, position, variant, asChild, ...props
}: DotProps) {
  const Component = asChild ? Slot.View : View;
  return (
    <Component
      className={cn(dotVariants({ position, variant }), className)}
      {...props} />
  );
}

export { Dot, dotVariants };
export type { DotProps };