import { forwardRef } from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/utils';
import type { ViewRef } from '@rn-primitives/types';
import type { TextProps, ViewProps } from 'react-native';

const List = forwardRef<ViewRef, ViewProps>(({ className, ...props }, ref) => (
  <View
    className={cn('flex flex-col space-y-2', className)}
    ref={ref}
    {...props} />
));
List.displayName = 'List';

interface ListItemProps extends ViewProps {
  text?: string;
  textProps?: TextProps;
}

const ListItem = forwardRef<ViewRef, ListItemProps>(({
  className, text, textProps, ...props
}, ref) => (
  <View
    className={cn('flex flex-row items-center p-4 border-b border-muted-foreground', className)}
    ref={ref}
    {...props}>
    {text && <Text {...textProps}>
      {text}
    </Text>}
  </View>
));
ListItem.displayName = 'ListItem';

export { List, ListItem };