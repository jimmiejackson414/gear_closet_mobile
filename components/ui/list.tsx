import { forwardRef } from 'react';
import { View } from 'react-native';
import { cn } from '@/lib/utils';
import { Muted, P } from './typography';
import type { ViewRef } from '@rn-primitives/types';
import type { ReactNode } from 'react';
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
  subText?: string;
  subTextProps?: TextProps;
  icon?: ReactNode;
  hasBorder?: boolean;
}

const ListItem = forwardRef<ViewRef, ListItemProps>(({
  className, hasBorder = true, text, textProps, subText, subTextProps, icon, ...props
}, ref) => (
  <View
    className={cn(
      'flex flex-row items-center p-4 w-full gap-8',
      { 'border-b border-border': hasBorder },
      className,
    )}
    ref={ref}
    {...props}>
    {icon && (
      <View
        className="mr-4"
        style={{ width: 20 }}>
        {icon}
      </View>
    )}
    <View className="flex flex-col">
      {text && <P {...textProps}>
        {text}
      </P>}
      {subText && <Muted {...subTextProps}>
        {subText}
      </Muted>}
    </View>
  </View>
));
ListItem.displayName = 'ListItem';

export { List, ListItem };