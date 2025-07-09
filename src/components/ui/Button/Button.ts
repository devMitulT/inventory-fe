import { type VariantProps } from "class-variance-authority";
import BUTTON from "./constant";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof BUTTON.buttonVariants> {
  asChild?: boolean;
}
export interface ButtonDefaultProps extends Omit<ButtonProps, "prefix"> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
}
