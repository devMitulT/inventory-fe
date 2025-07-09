import * as React from "react";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/Button";
import BUTTON from "../Button/constant";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-end", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  )
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      BUTTON.buttonVariants({
        variant: isActive ? "default" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  onFirstPageClick,
  onPrevPageClick,
  className,
  ...props
}: {
  onFirstPageClick?: (e: React.MouseEvent) => void;
  onPrevPageClick?: (e: React.MouseEvent) => void;
} & React.ComponentProps<typeof PaginationLink>) => (
  <>
    <PaginationLink
      aria-label="Go to first page"
      size="default"
      className={cn("mx-1 bg-gray-200 text-gray-500", className)}
      onClick={onFirstPageClick}
      {...props}
    >
      <ChevronFirst className="h-5 w-5" />
    </PaginationLink>
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("mx-1 bg-gray-200 text-gray-500", className)}
      onClick={onPrevPageClick}
      {...props}
    >
      <ChevronLeft className="h-5 w-5" />
    </PaginationLink>
  </>
);

PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  onNextPageClick,
  onLastPageClick,
  className,
  ...props
}: {
  onNextPageClick?: (e: React.MouseEvent) => void;
  onLastPageClick?: (e: React.MouseEvent) => void;
} & React.ComponentProps<typeof PaginationLink>) => (
  <>
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("mx-1 bg-black text-white", className)}
      onClick={onNextPageClick}
      {...props}
    >
      <ChevronRight className="h-5 w-5" />
    </PaginationLink>
    <PaginationLink
      aria-label="Go to last page"
      size="default"
      className={cn("mx-1 bg-black text-white", className)}
      onClick={onLastPageClick}
      {...props}
    >
      <ChevronLast className="h-5 w-5" />
    </PaginationLink>
  </>
);

PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
