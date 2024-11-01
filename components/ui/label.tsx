import { forwardRef } from 'react';
import * as LabelPrimitive from '@rn-primitives/label';
import { cn } from '@/lib/utils';

const Label = forwardRef<LabelPrimitive.TextRef, LabelPrimitive.TextProps>(
  ({
    className, onPress, onLongPress, onPressIn, onPressOut, ...props
  }, ref) => (
    <LabelPrimitive.Root
      className="web:cursor-default"
      onLongPress={onLongPress}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <LabelPrimitive.Text
        className={cn(
          'text-sm text-foreground native:text-base font-medium leading-none web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70',
          className,
        )}
        ref={ref}
        {...props} />
    </LabelPrimitive.Root>
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
