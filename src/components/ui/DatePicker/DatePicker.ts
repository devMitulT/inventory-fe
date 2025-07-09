import { ReactNode } from "react";
import { Matcher, SelectSingleEventHandler } from "react-day-picker";

export interface DatePickerProps {
  children: ReactNode;
  selectedValue?: Date;
  onSelect?: SelectSingleEventHandler;
  disabled?: Matcher | Matcher[];
  month: Date | undefined;
}
