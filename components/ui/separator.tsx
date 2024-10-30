import { forwardRef } from 'react';
import * as SeparatorPrimitive from '@rn-primitives/separator';
import { cn } from '@/lib/utils';

const Separator = forwardRef<SeparatorPrimitive.RootRef, SeparatorPrimitive.RootProps>(
  ({
    className, orientation = 'horizontal', decorative = true, ...props
  }, ref) => (
    <SeparatorPrimitive.Root
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      decorative={decorative}
      orientation={orientation}
      ref={ref}
      {...props} />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
