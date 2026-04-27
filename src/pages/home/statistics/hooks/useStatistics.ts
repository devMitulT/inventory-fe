import { useMemo, useState } from "react";

import { useGetStatistics } from "@/services/queries";
import {
  DateRangeOption,
  statisticsBreadCrumb,
} from "../constants";

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const resolveRange = (
  option: DateRangeOption,
  customFrom?: Date,
  customTo?: Date,
): { from?: Date; to?: Date } => {
  const today = new Date();
  if (option === "today") {
    return { from: startOfDay(today), to: endOfDay(today) };
  }
  if (option === "lastWeek") {
    const from = new Date(today);
    from.setDate(today.getDate() - 6);
    return { from: startOfDay(from), to: endOfDay(today) };
  }
  if (option === "lastMonth") {
    const from = new Date(today);
    from.setDate(today.getDate() - 29);
    return { from: startOfDay(from), to: endOfDay(today) };
  }
  if (customFrom && customTo) {
    return { from: startOfDay(customFrom), to: endOfDay(customTo) };
  }
  return {};
};

const formatDayLabel = (date: Date) =>
  date.toLocaleString("en-US", { day: "2-digit", month: "short" });

const eachDayBetween = (from: Date, to: Date): Date[] => {
  const days: Date[] = [];
  const cursor = startOfDay(from);
  const last = startOfDay(to);
  while (cursor.getTime() <= last.getTime()) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
};

export const useStatistics = () => {
  const [option, setOption] = useState<DateRangeOption>("today");
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();

  const { from, to } = useMemo(
    () => resolveRange(option, customFrom, customTo),
    [option, customFrom, customTo],
  );

  const { data, isLoading } = useGetStatistics({
    startDate: from ? from.toISOString() : "",
    endDate: to ? to.toISOString() : "",
  });

  const stats = data?.data ?? {};
  const totalBooking: number = stats.totalOrders ?? 0;
  const totalRevenue: number =
    stats.totalNetRevenue ?? stats.grossRevenue ?? 0;
  const revenueInCash: number = stats.revenueInCash ?? 0;
  const revenueOnline: number = stats.revenueOnline ?? 0;

  const days = useMemo(
    () => (from && to ? eachDayBetween(from, to) : []),
    [from, to],
  );

  const revenuePoints = useMemo(() => {
    if (!days.length) return [];
    return days.map((d, idx) => ({
      label: formatDayLabel(d),
      value: idx === days.length - 1 ? totalRevenue : 0,
    }));
  }, [days, totalRevenue]);

  const bookingPoints = useMemo(() => {
    if (!days.length) return [];
    return days.map((d, idx) => ({
      label: formatDayLabel(d),
      value: idx === days.length - 1 ? totalBooking : 0,
    }));
  }, [days, totalBooking]);

  const handleOptionChange = (next: DateRangeOption) => {
    setOption(next);
    if (next !== "custom") {
      setCustomFrom(undefined);
      setCustomTo(undefined);
    }
  };

  const handleFromChange = (date?: Date) => {
    setCustomFrom(date);
    if (customTo && date && date > customTo) {
      setCustomTo(undefined);
    }
  };

  const handleToChange = (date?: Date) => {
    setCustomTo(date);
  };

  return {
    option,
    customFrom,
    customTo,
    handleOptionChange,
    handleFromChange,
    handleToChange,
    isLoading,
    totalBooking,
    totalRevenue,
    revenueInCash,
    revenueOnline,
    revenuePoints,
    bookingPoints,
    statisticsBreadCrumb,
  };
};
