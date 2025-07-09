type Level = 1 | 2 | 3 | 4 | 5 | 6;
type Size = "small" | "medium" | "large";

export interface TitleProps {
  level?: Level;
  children: React.ReactNode;
  className?: string;
}

export interface TextProps {
  strong?: boolean;
  italic?: boolean;
  underline?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface ParagraphProps {
  size?: Size;
  children: React.ReactNode;
  className?: string;
}
