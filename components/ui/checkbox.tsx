import { forwardRef } from 'react';
import { Platform, Text, View } from 'react-native';
import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import { TextClassContext } from '@/components/ui/text';
import { CheckIcon } from '@/lib/icons/Check';
import { cn } from '@/lib/utils';

interface CheckboxProps extends CheckboxPrimitive.RootProps {
  label?: string;
  className?: string;
}

const Checkbox = forwardRef<CheckboxPrimitive.RootRef, CheckboxProps>(
  ({
    className, label, ...props
  }, ref) => {
    return (
      <TextClassContext.Provider value="text-text">
        <View className="flex flex-row items-center">
          <CheckboxPrimitive.Root
            className={cn(
              'web:peer h-4 w-4 native:h-[20] native:w-[20] shrink-0 rounded-sm native:rounded border border-primary web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              props.checked && 'bg-primary',
              className,
            )}
            ref={ref}
            {...props}>
            <CheckboxPrimitive.Indicator className={cn('items-center justify-center h-full w-full')}>
              <CheckIcon
                className="text-primary-foreground"
                size={12}
                strokeWidth={Platform.OS === 'web' ? 2.5 : 3.5} />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
          {label && (
            <TextClassContext.Consumer>
              {textClass => (
                <Text className={cn(textClass, 'ml-2')}>
                  {label}
                </Text>
              )}
            </TextClassContext.Consumer>
          )}
        </View>
      </TextClassContext.Provider>
    );
  },
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };