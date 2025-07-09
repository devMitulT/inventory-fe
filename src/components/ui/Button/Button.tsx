import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { ButtonDefaultProps } from "./Button";
import BUTTON from "./constant";

export const Button = React.forwardRef<HTMLButtonElement, ButtonDefaultProps>(
  (
    { className, variant, size, asChild = false, children, prefix, suffix, icon, ...props },
    ref
  ) => {
    const Component = asChild ? Slot : "button";
    return (
      <Component
        className={cn(BUTTON.buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon ? (
          <>{icon}</>
        ) : (
          <>
            {prefix} {children} {suffix}
          </>
        )}
      </Component>
    );
  }
);
