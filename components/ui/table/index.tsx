import React, { createContext, useContext, useMemo } from 'react';
import { TBody as ExpoTBody,
  Caption as ExpoTCaption,
  TFoot as ExpoTFoot,
  THead as ExpoTHead,
  TR as ExpoTR,
  Table as ExpoTable } from '@expo/html-elements';
import { Text, View } from 'react-native';
import { tableBodyStyle,
  tableCaptionStyle,
  tableDataStyle,
  tableFooterStyle,
  tableHeadStyle,
  tableHeaderStyle,
  tableRowStyleStyle,
  tableStyle } from './styles';

const TableHeaderContext = createContext<any>({});
const TableFooterContext = createContext<any>({});

type ITableProps = React.ComponentProps<typeof ExpoTable>;
type ITableHeaderProps = React.ComponentProps<typeof ExpoTHead>;
type ITableBodyProps = React.ComponentProps<typeof ExpoTBody>;
type ITableFooterProps = React.ComponentProps<typeof ExpoTFoot>;
type ITableHeadProps = React.ComponentProps<typeof View | typeof Text> & {
  useRNView?: boolean;
};
type ITableRowProps = React.ComponentProps<typeof ExpoTR>;
type ITableDataProps = React.ComponentProps<typeof View | typeof Text> & {
  useRNView?: boolean;
};
type ITableCaptionProps = React.ComponentProps<typeof ExpoTCaption>;

const Table = React.forwardRef<React.ElementRef<typeof ExpoTable>, ITableProps>(
  ({ className, ...props }, ref) => {
    return (
      <ExpoTable
        className={tableStyle({ class: className })}
        // @ts-ignore
        ref={ref}
        {...props} />
    );
  },
);

const TableHeader = React.forwardRef<
  React.ElementRef<typeof ExpoTHead>,
  ITableHeaderProps
>(({ className, ...props }, ref) => {
  const contextValue = useMemo(() => {
    return { isHeaderRow: true };
  }, []);
  return (
    <TableHeaderContext.Provider value={contextValue}>
      <ExpoTHead
        className={tableHeaderStyle({ class: className })}
        // @ts-ignore
        ref={ref}
        {...props} />
    </TableHeaderContext.Provider>
  );
});

const TableBody = React.forwardRef<
  React.ElementRef<typeof ExpoTBody>,
  ITableBodyProps
>(({ className, ...props }, ref) => {
  return (
    <ExpoTBody
      className={tableBodyStyle({ class: className })}
      // @ts-ignore
      ref={ref}
      {...props} />
  );
});

const TableFooter = React.forwardRef<
  React.ElementRef<typeof ExpoTFoot>,
  ITableFooterProps
>(({ className, ...props }, ref) => {
  const contextValue = useMemo(() => {
    return { isFooterRow: true };
  }, []);
  return (
    <TableFooterContext.Provider value={contextValue}>
      <ExpoTFoot
        className={tableFooterStyle({ class: className })}
        // @ts-ignore
        ref={ref}
        {...props} />
    </TableFooterContext.Provider>
  );
});

const TableHead = React.forwardRef<
  React.ElementRef<typeof View | typeof Text>,
  ITableHeadProps
>(({
  useRNView = false, className, ...props
}, ref) => {
  if (useRNView) {
    return (
      <View
        className={tableHeadStyle({ class: className })}
        ref={ref}
        {...props} />
    );
  } else {
    return (
      <Text
        className={tableHeadStyle({ class: className })}
        ref={ref}
        {...props} />
    );
  }
});

const TableRow = React.forwardRef<
  React.ElementRef<typeof ExpoTR>,
  ITableRowProps
>(({ className, ...props }, ref) => {
  const { isHeaderRow } = useContext(TableHeaderContext);
  const { isFooterRow } = useContext(TableFooterContext);

  return (
    <ExpoTR
      className={tableRowStyleStyle({
        isHeaderRow,
        isFooterRow,
        class: className,
      })}
      // @ts-ignore
      ref={ref}
      {...props} />
  );
});

const TableData = React.forwardRef<
  React.ElementRef<typeof View | typeof Text>,
  ITableDataProps
>(({
  useRNView = false, className, ...props
}, ref) => {
  if (useRNView) {
    return (
      <View
        className={tableDataStyle({ class: className })}
        ref={ref}
        {...props} />
    );
  } else {
    return (
      <Text
        className={tableDataStyle({ class: className })}
        ref={ref}
        {...props} />
    );
  }
});

const TableCaption = React.forwardRef<
  React.ElementRef<typeof ExpoTCaption>,
  ITableCaptionProps
>(({ className, ...props }, ref) => {
  return (
    <ExpoTCaption
      className={tableCaptionStyle({ class: className })}
      // @ts-ignore
      ref={ref}
      {...props} />
  );
});

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableFooter.displayName = 'TableFooter';
TableHead.displayName = 'TableHead';
TableRow.displayName = 'TableRow';
TableData.displayName = 'TableData';
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableData,
  TableCaption,
};
