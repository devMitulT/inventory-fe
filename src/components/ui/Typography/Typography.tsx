import React from "react";
import { ParagraphProps, TextProps, TitleProps } from "./Typography";
import { cn } from "@/lib/utils";

const Title: React.FC<TitleProps> = ({ level = 1, children, className = "" }) => {
  const baseStyles = "font-bold tracking-tight";
  const levelStyles = {
    1: "text-4xl lg:text-5xl",
    2: "text-3xl lg:text-4xl",
    3: "text-2xl lg:text-3xl",
    4: "text-xl lg:text-2xl",
    5: "text-lg lg:text-xl",
    6: "text-sm lg:text-sm ",
  }[level];

  const Component = `h${level}` as keyof JSX.IntrinsicElements;

  return <Component className={cn(baseStyles, levelStyles, className)}>{children}</Component>;
};

const Text: React.FC<TextProps> = ({
  strong = false,
  italic = false,
  underline = false,
  children,
  className = "",
}) => {
  const styles = [
    "text-base",
    strong && "font-semibold",
    italic && "italic",
    underline && "underline",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={cn(styles, className)}>{children}</span>;
};

const Paragraph: React.FC<ParagraphProps> = ({ size = "small", children, className = "" }) => {
  const sizeStyles = {
    small: "text-sm leading-relaxed",
    medium: "text-base leading-relaxed",
    large: "text-md leading-relaxed",
  }[size];

  return <p className={cn(sizeStyles, className)}>{children}</p>;
};

export const Typography = {
  Title,
  Text,
  Paragraph,
} as const;
