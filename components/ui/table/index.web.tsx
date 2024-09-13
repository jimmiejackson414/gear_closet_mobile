import React, { createContext, useContext, useMemo } from 'react';
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

const Table = React.forwardRef(({ className, ...props }: any, ref?: any) => {
  return <table
    className={tableStyle({ class: className })}
    ref={ref}
    {...props} />;
});

const TableHeader = React.forwardRef(
  ({ className, ...props }: any, ref?: any) => {
    const contextValue = useMemo(() => {
      return { isHeaderRow: true };
    }, []);
    return (
      <TableHeaderContext.Provider value={contextValue}>
        <thead
          className={tableHeaderStyle({ class: className })}
          ref={ref}
          {...props} />
      </TableHeaderContext.Provider>
    );
  },
);

const TableBody = React.forwardRef(
  ({ className, ...props }: any, ref?: any) => {
    return (
      <tbody
        className={tableBodyStyle({ class: className })}
        ref={ref}
        {...props} />
    );
  },
);

const TableFooter = React.forwardRef(
  ({ className, ...props }: any, ref?: any) => {
    const contextValue = useMemo(() => {
      return { isFooterRow: true };
    }, []);
    return (
      <TableFooterContext.Provider value={contextValue}>
        <tfoot
          className={tableFooterStyle({ class: className })}
          ref={ref}
          {...props} />
      </TableFooterContext.Provider>
    );
  },
);

const TableHead = React.forwardRef(
  ({ className, ...props }: any, ref?: any) => {
    return (
      <th
        className={tableHeadStyle({ class: className })}
        ref={ref}
        {...props} />
    );
  },
);

const TableRow = React.forwardRef(({ className, ...props }: any, ref?: any) => {
  const { isHeaderRow } = useContext(TableHeaderContext);
  const { isFooterRow } = useContext(TableFooterContext);
  return (
    <tr
      className={tableRowStyleStyle({
        isHeaderRow,
        isFooterRow,
        class: className,
      })}
      ref={ref}
      {...props} />
  );
});

const TableData = React.forwardRef(
  ({ className, ...props }: any, ref?: any) => {
    return (
      <td
        className={tableDataStyle({ class: className })}
        ref={ref}
        {...props} />
    );
  },
);

const TableCaption = React.forwardRef(
  ({ className, ...props }: any, ref?: any) => {
    return (
      <caption
        className={tableCaptionStyle({ class: className })}
        ref={ref}
        {...props} />
    );
  },
);

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
