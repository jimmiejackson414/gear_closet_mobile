import React, { forwardRef, memo } from 'react';
import { H1, H2, H3, H4, H5, H6 } from '@expo/html-elements';
import { cssInterop } from 'nativewind';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { headingStyle } from './styles';

type IHeadingProps = VariantProps<typeof headingStyle> &
  React.ComponentPropsWithoutRef<typeof H1> & {
    as?: React.ElementType;
  };

cssInterop(H1, { className: 'style' });
cssInterop(H2, { className: 'style' });
cssInterop(H3, { className: 'style' });
cssInterop(H4, { className: 'style' });
cssInterop(H5, { className: 'style' });
cssInterop(H6, { className: 'style' });

const MappedHeading = memo(
  forwardRef<HTMLElement, IHeadingProps>(
    (
      {
        size,
        className,
        isTruncated,
        bold,
        underline,
        strikeThrough,
        sub,
        italic,
        highlight,
        ...props
      },
      ref,
    ) => {
      const commonProps = {
        className: headingStyle({
          size,
          isTruncated,
          bold,
          underline,
          strikeThrough,
          sub,
          italic,
          highlight,
          class: className,
        }),
        ...props,
        ref: ref as React.Ref<any>, // Cast ref to any to avoid type mismatch
      };

      switch (size) {
        case '5xl':
        case '4xl':
        case '3xl':
          return <H1 {...commonProps} />;
        case '2xl':
          return <H2 {...commonProps} />;
        case 'xl':
          return <H3 {...commonProps} />;
        case 'lg':
          return <H4 {...commonProps} />;
        case 'md':
          return <H5 {...commonProps} />;
        case 'sm':
        case 'xs':
          return <H6 {...commonProps} />;
        default:
          return <H4 {...commonProps} />;
      }
    },
  ),
);

const Heading = memo(
  forwardRef<HTMLElement, IHeadingProps>(
    ({
      className, size = 'lg', as: AsComp, ...props
    }, ref) => {
      const {
        isTruncated,
        bold,
        underline,
        strikeThrough,
        sub,
        italic,
        highlight,
      } = props;

      if (AsComp) {
        return (
          <AsComp
            className={headingStyle({
              size,
              isTruncated,
              bold,
              underline,
              strikeThrough,
              sub,
              italic,
              highlight,
              class: className,
            })}
            {...props} />
        );
      }

      return <MappedHeading
        className={className}
        ref={ref}
        size={size}
        {...props} />;
    },
  ),
);

Heading.displayName = 'Heading';

export { Heading };