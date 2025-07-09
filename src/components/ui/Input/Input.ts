import React from "react";

export enum LayoutEnum {
  Vertical = "VERTICAL",
  Horizontal = "HORIZONTAL",
}

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  labelClassName?: string;
  layout?: "vertical" | "horizontal";
  labelGap?: string | number;
  colon?: boolean;
  showPasswordToggle?: boolean;
}
