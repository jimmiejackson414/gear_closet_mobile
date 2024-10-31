import { forwardRef } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { type VariantProps, cva } from 'class-variance-authority';
import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary web:hover:opacity-90 active:opacity-90',
        destructive: 'bg-destructive web:hover:opacity-90 active:opacity-90',
        outline:
          'border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        secondary: 'bg-secondary web:hover:opacity-80 active:opacity-80',
        ghost: 'web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        link: 'web:underline-offset-4 web:hover:underline web:focus:underline ',
      },
      size: {
        default: 'h-10 px-4 py-2 native:h-12 native:px-5 native:py-3',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8 native:h-14',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const buttonTextVariants = cva(
  'web:whitespace-nowrap text-sm native:text-base font-medium text-primary-foreground web:transition-colors',
  {
    variants: {
      variant: {
        default: '!text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'group-active:text-accent-foreground',
        secondary: 'text-secondary-foreground group-active:text-secondary-foreground',
        ghost: 'group-active:text-accent-foreground',
        link: 'text-primary group-active:underline',
      },
      size: {
        default: '',
        sm: '',
        lg: 'native:text-lg',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    children: string; // Enforce children to be of type string
  };

const Button = forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({
    className, variant, size, loading, children, ...props
  }, ref) => {
    return (
      <TextClassContext.Provider value={cn(
        (props.disabled || loading) && 'web:pointer-events-none',
        buttonTextVariants({ variant, size }),
      )}>
        <Pressable
          className={cn(
            (props.disabled || loading) && 'opacity-50 web:pointer-events-none',
            buttonVariants({
              variant, size, className,
            }),
          )}
          disabled={props.disabled || loading}
          ref={ref}
          role="button"
          {...props}>
          {loading ? <ActivityIndicator color="white" /> : (
            <Text className={cn(buttonTextVariants({ variant, size }))}>
              {children}
            </Text>
          )}
        </Pressable>
      </TextClassContext.Provider>
    );
  },
);
Button.displayName = 'Button';

export {
  Button, buttonTextVariants, buttonVariants,
};
export type { ButtonProps };