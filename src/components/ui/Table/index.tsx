import { cn } from "@/lib/utils";
import React from "react";
import { Table as UiTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/Table/pagination";
import { Typography } from "../Typography";
interface Column<T> {
  header: string;
  accessor: keyof T | string;
  renderCell?: (value: any, rowData: T) => React.ReactNode;
}

interface CommonTableProps<T> {
  columns: Column<T>[];
  data: T[];
  headerColor?: string;
  rowColor?: string;
  nestedTableConfig?: {
    headerColor?: string;
    rowColor?: string;
    identifier: keyof T;
    nestedColumns: Column<any>[];
    nestedData: Map<any, T[]>;
  };
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  isLoading?: boolean; // Accept isLoading prop
}

const getValueFromAccessor = (rowData: any, accessor: string) => {
  return accessor.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), rowData);
};

const CommonTable = <T,>({
  columns,
  data,
  nestedTableConfig,
  headerColor,
  rowColor,
  pagination = {
    page: 0,
    totalPages: 0,
    onPageChange: () => {},
  },
  isLoading = false, // Default value for isLoading is false
}: CommonTableProps<T>) => {
  const { page, totalPages, onPageChange } = pagination;
  return (
    <>
      <UiTable className="overflow-hidden rounded-lg">
        <TableHeader className={cn(headerColor ? headerColor : "bg-gray-100", "text-md")}>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className="px-6 py-1 text-[#4D4D4D]">
                {column.header !== "Notes" && column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="py-8 text-center">
                <div className="flex items-center justify-center p-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-gray-500"></div>
                </div>
                <span>Loading...</span>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="p-10 text-center text-gray-400">
                  No Data Found
                </TableCell>
              </TableRow>
            ) : (
              data.map((rowData, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <TableRow
                    className={cn(
                      data.length > 3 &&
                        "[&:last-child_.select-item_>_div]:bottom-9 [&:nth-last-child(2)_.select-item_>_div]:bottom-[35px] [&_.select-item_>_div]:!absolute [&_.select-item_>_div_*]:!z-[999]",
                      "h-12 transition-all duration-200 ease-in-out",
                      rowColor ? rowColor : "odd:bg-white even:bg-white"
                    )}
                  >
                    {columns.map((column, colIndex) => {
                      const value = getValueFromAccessor(rowData, column.accessor as string);

                      return (
                        <TableCell key={colIndex} className="px-6 text-sm">
                          {column.renderCell
                            ? column.renderCell(value, rowData)
                            : column.accessor === "notes"
                              ? ""
                              : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {nestedTableConfig &&
                    nestedTableConfig.nestedData.has(rowData[nestedTableConfig.identifier]) && (
                      <TableRow className="nested-table">
                        <TableCell
                          className="border-b-[6px] border-[#faf9f9] p-0"
                          colSpan={columns.length + 1}
                        >
                          <CommonTable
                            columns={nestedTableConfig.nestedColumns}
                            data={
                              nestedTableConfig.nestedData.get(
                                rowData[nestedTableConfig.identifier]
                              ) || []
                            }
                            headerColor={nestedTableConfig.headerColor}
                            rowColor={nestedTableConfig.rowColor}
                            pagination={{
                              page: 0,
                              totalPages: 0,
                              onPageChange: () => {},
                            }}
                          />
                          <div className="flex w-full justify-center bg-white">
                            <Typography.Text className="mx-2 my-2 flex w-full flex-row gap-1.5 rounded-md bg-[#FFFBEC] px-2 py-3 text-sm font-normal text-[#4D4D4D]">
                              <div className="text-sm font-semibold text-[#4D4D4D]">Notes:</div>
                              {getValueFromAccessor(rowData, "notes") ?? "N/A"}
                            </Typography.Text>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        )}
      </UiTable>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={cn(
                  page > 1
                    ? "cursor-pointer bg-black text-white hover:bg-[#1a1a1a] hover:text-white"
                    : "cursor-not-allowed bg-[#F2F2F2] text-[#B3B3B3] hover:text-[#B3B3B3]"
                )}
                onFirstPageClick={(e) => {
                  e.preventDefault();
                  if (page > 1) onPageChange(1);
                }}
                onPrevPageClick={(e) => {
                  e.preventDefault();
                  if (page > 1) onPageChange(page - 1);
                }}
              />
            </PaginationItem>

            {[1, 2].map(
              (pageNumber) =>
                pageNumber <= totalPages && (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNumber}
                      className={cn(
                        page === pageNumber
                          ? "bg-white text-black"
                          : "text-[#B3B3B3] hover:bg-[#e6e6e6] hover:text-black"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
            )}

            {page > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {page > 2 && page < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  className="bg-white text-black"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )}

            {page < totalPages - 3 && (
              <PaginationItem className="text-[#B3B3B3]">
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {[totalPages - 1, totalPages].map(
              (pageNumber) =>
                pageNumber > 2 &&
                pageNumber <= totalPages && (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNumber}
                      className={cn(
                        page === pageNumber
                          ? "bg-white text-black"
                          : "text-[#B3B3B3] hover:bg-[#e6e6e6] hover:text-black"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
            )}

            <PaginationItem>
              <PaginationNext
                className={cn(
                  page < totalPages
                    ? "cursor-pointer bg-black text-white hover:bg-[#1a1a1a] hover:text-white"
                    : "cursor-not-allowed bg-[#F2F2F2] text-[#B3B3B3] hover:text-[#B3B3B3]"
                )}
                onNextPageClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) onPageChange(page + 1);
                }}
                onLastPageClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) onPageChange(totalPages);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default CommonTable;
