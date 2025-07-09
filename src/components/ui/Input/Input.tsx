import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { InputProps, LayoutEnum } from "./Input";
import { Label } from "../Label";
import { Eye, EyeOff } from "lucide-react";
const InputField = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      labelClassName,
      layout = "vertical",
      labelGap = 0.5,
      colon = false,
      name,
      id,
      showPasswordToggle = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div
        style={{
          gap: typeof labelGap === "string" ? labelGap : `${labelGap}rem`,
        }}
        className={
          layout === LayoutEnum.Vertical.toLowerCase() ? `flex flex-col` : `flex items-center`
        }
      >
        {label && (
          <Label
            htmlFor={id}
            className={cn("whitespace-nowrap font-normal text-[#7B7B7B]", labelClassName)}
          >{`${label}${colon ? ":" : ""}`}</Label>
        )}
        <div className="w-full">
          <input
            type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
            id={id}
            name={name}
            className={cn(
              "flex h-8 w-full rounded-lg border border-input bg-transparent pl-3 text-base font-medium text-black shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-black focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className
            )}
            ref={ref}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="h-4 w-4" aria-hidden="true" />
              ) : (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

export { InputField };
