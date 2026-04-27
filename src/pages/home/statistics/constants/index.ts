export const statisticsBreadCrumb = ["Statistics"];

export type DateRangeOption =
  | "today"
  | "lastWeek"
  | "lastMonth"
  | "custom";

export const dateRangeOptions: { value: DateRangeOption; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "lastWeek", label: "Last Week" },
  { value: "lastMonth", label: "Last Month" },
  { value: "custom", label: "Custom Date" },
];
