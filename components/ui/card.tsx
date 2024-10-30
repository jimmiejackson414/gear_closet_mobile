import { forwardRef } from 'react';
import { Text, View } from 'react-native';
import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { TextRef, ViewRef } from '@rn-primitives/types';
import type { TextProps, ViewProps } from 'react-native';

const Card = forwardRef<ViewRef, ViewProps>(({ className, ...props }, ref) => (
  <View
    className={cn(
      'rounded-lg border border-border bg-card shadow-sm shadow-foreground/10',
      className,
    )}
    ref={ref}
    {...props} />
));
Card.displayName = 'Card';

const CardHeader = forwardRef<ViewRef, ViewProps>(({ className, ...props }, ref) => (
  <View
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    ref={ref}
    {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<TextRef, React.ComponentPropsWithoutRef<typeof Text>>(
  ({ className, ...props }, ref) => (
    <Text
      aria-level={3}
      className={cn(
        'text-2xl text-card-foreground font-semibold leading-none tracking-tight',
        className,
      )}
      ref={ref}
      role="heading"
      {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<TextRef, TextProps>(({ className, ...props }, ref) => (
  <Text
    className={cn('text-sm text-muted-foreground', className)}
    ref={ref}
    {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<ViewRef, ViewProps>(({ className, ...props }, ref) => (
  <TextClassContext.Provider value="text-card-foreground">
    <View
      className={cn('p-6 pt-0', className)}
      ref={ref}
      {...props} />
  </TextClassContext.Provider>
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<ViewRef, ViewProps>(({ className, ...props }, ref) => (
  <View
    className={cn('flex flex-row items-center p-6 pt-0', className)}
    ref={ref}
    {...props} />
));
CardFooter.displayName = 'CardFooter';

export {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
};
