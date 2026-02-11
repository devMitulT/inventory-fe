import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import React from "react";

interface SmartPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const SmartPagination: React.FC<SmartPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const generatePages = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (i === page - 2 || i === page + 2) {
        pages.push("...");
      }
    }

    return [...new Set(pages)];
  };

  const pages = generatePages();

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              page > 1
                ? "cursor-pointer bg-black text-white hover:bg-gray-400"
                : "cursor-not-allowed bg-gray-200 text-gray-400",
            )}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
          />
        </PaginationItem>

        {pages.map((p, index) =>
          p === "..." ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={page === p}
                className={cn(
                  page === p ? "bg-black text-white" : "hover:bg-gray-200",
                )}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  onPageChange(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            className={cn(
              page < totalPages
                ? "cursor-pointer bg-black text-white hover:bg-gray-400"
                : "cursor-not-allowed bg-gray-200 text-gray-400",
            )}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
