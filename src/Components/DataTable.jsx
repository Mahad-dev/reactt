import React, { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const DataTable = ({
  data,
  columns,
  enablePagination = false,
  pageIndex = 1,
  maxPages = 1,
  setPageIndex = null,
}) => {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="tableWrapper">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortingFn = () => {
                    if (!canSort) {
                      return;
                    }
                    header.column.toggleSorting();
                  };
                  const sortState = header.column.getIsSorted();
                  return (
                    <th onClick={sortingFn} key={header.id}>
                      <div>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}{" "}
                        {header.column.getCanSort() && (
                          <div>
                            {!sortState ? (
                              <>&uarr;&darr;</>
                            ) : sortState === "asc" ? (
                              <>&uarr;</>
                            ) : (
                              <>&darr;</>
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr className="rowModelStyle" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {enablePagination && (
        <div className="flex pagination">
          {pageIndex > 4 && (
            <>
              {" "}
              <div onClick={() => setPageIndex(1)}>{1}</div>
              <span>...</span>
            </>
          )}
          {pageIndex > 2 && (
            <div onClick={() => setPageIndex(pageIndex - 2)}>
              {pageIndex - 2}
            </div>
          )}
          {pageIndex > 1 && (
            <div onClick={() => setPageIndex(pageIndex - 1)}>
              {pageIndex - 1}
            </div>
          )}
          <div className="active" onClick={() => {}}>
            {pageIndex}
          </div>
          {pageIndex + 1 <= maxPages && (
            <div onClick={() => setPageIndex(pageIndex + 1)}>
              {pageIndex + 1}
            </div>
          )}
          {pageIndex + 2 <= maxPages && (
            <div onClick={() => setPageIndex(pageIndex + 2)}>
              {pageIndex + 2}
            </div>
          )}
          {pageIndex < maxPages - 3 && (
            <>
              {" "}
              <span>...</span>
              <div onClick={() => setPageIndex(maxPages)}>{maxPages}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
