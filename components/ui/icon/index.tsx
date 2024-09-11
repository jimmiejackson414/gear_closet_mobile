'use client';
import React, { useMemo } from 'react';
import { createIcon } from '@gluestack-ui/icon';
import { Svg } from 'react-native-svg';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { cssInterop } from 'nativewind';
import { VariantProps } from '@gluestack-ui/nativewind-utils';

type IPrimitiveIcon = {
  height?: number | string;
  width?: number | string;
  fill?: string;
  color?: string;
  size?: number | string;
  stroke?: string;
  as?: React.ElementType;
  className?: string;
};

const PrimitiveIcon = React.forwardRef<
  React.ElementRef<typeof Svg>,
  IPrimitiveIcon
>(({
  height, width, fill, color, size, stroke, as: AsComp, ...props
}, ref) => {
  const sizeProps = useMemo(() => {
    if (size) return { size };
    if (height && width) return { height, width };
    if (height) return { height };
    if (width) return { width };
    return {};
  }, [size, height, width]);

  let colorProps = {};
  if (color) {
    colorProps = { ...colorProps, color: color };
  }
  if (stroke) {
    colorProps = { ...colorProps, stroke: stroke };
  }
  if (fill) {
    colorProps = { ...colorProps, fill: fill };
  }
  if (AsComp) {
    return <AsComp
      ref={ref}
      {...sizeProps}
      {...colorProps}
      {...props} />;
  }
  return (
    <Svg
      height={height}
      ref={ref}
      width={width}
      {...colorProps}
      {...props} />
  );
});

PrimitiveIcon.displayName = 'PrimitiveIcon';

export const UIIcon = createIcon({ Root: PrimitiveIcon });

const iconStyle = tva({
  base: 'text-typography-950 fill-none',
  variants: {
    size: {
      '2xs': 'h-3 w-3',
      'xs': 'h-3.5 w-3.5',
      'sm': 'h-4 w-4',
      'md': 'h-[18px] w-[18px]',
      'lg': 'h-5 w-5',
      'xl': 'h-6 w-6',
    },
  },
});

//@ts-ignore
cssInterop(UIIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: true,
      stroke: true,
    },
  },
});

type IIConProps = IPrimitiveIcon &
  VariantProps<typeof iconStyle> &
  React.ComponentPropsWithoutRef<typeof UIIcon>;

export const Icon = React.forwardRef<React.ElementRef<typeof Svg>, IIConProps>(
  ({
    size = 'md', className, ...props
  }, ref) => {
    if (typeof size === 'number') {
      return (
        <UIIcon
          ref={ref}
          {...props}
          className={iconStyle({ class: className })}
          size={size} />
      );
    } else if (
      (props.height !== undefined || props.width !== undefined) &&
      size === undefined
    ) {
      return (
        <UIIcon
          ref={ref}
          {...props}
          className={iconStyle({ class: className })} />
      );
    }
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={iconStyle({ size, class: className })} />
    );
  },
);

Icon.displayName = 'Icon';

type ParameterTypes = Omit<Parameters<typeof createIcon>[0], 'Root'>;

const createIconUI = ({ ...props }: ParameterTypes) => {
  const UIIconCreateIcon = createIcon({ Root: Svg, ...props });

  // eslint-disable-next-line react/display-name
  return React.forwardRef<React.ElementRef<typeof Svg>>(
    (
      {
        className,
        size,
        ...props
      }: VariantProps<typeof iconStyle> &
        React.ComponentPropsWithoutRef<typeof UIIconCreateIcon>,
      ref,
    ) => {
      return (
        <UIIconCreateIcon
          // @ts-ignore
          ref={ref}
          {...props}
          className={iconStyle({ size, class: className })} />
      );
    },
  );
};
export { createIconUI as createIcon };
