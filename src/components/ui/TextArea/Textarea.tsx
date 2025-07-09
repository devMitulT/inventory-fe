import React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex h-[134px] min-h-[60px] w-full resize-none overflow-visible rounded-md border-none bg-[#FDFDFD] bg-transparent px-3 py-2 pb-5 pl-3 text-base font-medium outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

export { Textarea };
