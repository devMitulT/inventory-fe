import { useMemo, useState } from "react";

import { useGetOrgUsers, useGetStatistics } from "@/services/queries";
import { getCurrentUserRole } from "@/lib/utils";
import {
  DateRangeOption,
  statisticsBreadCrumb,
} from "../constants";
import type { LineSeries } from "../components/LineChart";

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

const formatDayLabel = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleString("en-US", { day: "2-digit", month: "short" });
};

const isoDay = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const eachDayBetween = (from: Date, to: Date): string[] => {
  const days: string[] = [];
  const cursor = startOfDay(from);
  const last = startOfDay(to);
  while (cursor.getTime() <= last.getTime()) {
    days.push(isoDay(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
};

// Stable colour palette assigned by user index
const PALETTE = [
  "#000000",
  "#2563EB",
  "#16A34A",
  "#F97316",
  "#9333EA",
  "#DB2777",
  "#0891B2",
  "#CA8A04",
];

interface DailyEntry {
  date: string;
  orders?: number;
  netRevenue?: number;
  grossRevenue?: number;
  units?: number;
}

interface BilledByEntry {
  billedBy: string | null;
  totalOrders?: number;
  totalNetRevenue?: number;
  grossRevenue?: number;
  totalUnitsSold?: number;
  daily?: DailyEntry[];
}

export const useStatistics = () => {
  const role = getCurrentUserRole();
  const isOrgAdmin = role === "superAdmin" || role === "admin";

  const [option, setOption] = useState<DateRangeOption>("today");
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();
  const [billedBy, setBilledBy] = useState<string>("");

  const { from, to } = useMemo(
    () => resolveRange(option, customFrom, customTo),
    [option, customFrom, customTo],
  );

  const { data: orgUsersData } = useGetOrgUsers();
  const orgUserOptions: { label: string; value: string }[] = isOrgAdmin
    ? (orgUsersData?.data ?? []).map((u: OrgUser) => ({
        label: u.name,
        value: u.name,
      }))
    : [];

  const { data, isLoading } = useGetStatistics({
    startDate: from ? from.toISOString() : "",
    endDate: to ? to.toISOString() : "",
    billedBy: billedBy || undefined,
  });

  const stats = data?.data ?? {};
  const totalBooking: number = stats.totalOrders ?? 0;
  const totalRevenue: number =
    stats.totalNetRevenue ?? stats.grossRevenue ?? 0;

  const dayKeys = useMemo(
    () => (from && to ? eachDayBetween(from, to) : []),
    [from, to],
  );
  const xLabels = useMemo(() => dayKeys.map(formatDayLabel), [dayKeys]);

  const byBilledBy: BilledByEntry[] = stats.byBilledBy ?? [];

  const buildSeries = (
    pickValue: (entry: DailyEntry) => number,
  ): LineSeries[] =>
    byBilledBy.map((entry, idx) => {
      const byDate = new Map<string, DailyEntry>();
      (entry.daily ?? []).forEach((d) => byDate.set(d.date, d));
      return {
        name: entry.billedBy || "Unassigned",
        color: PALETTE[idx % PALETTE.length],
        points: dayKeys.map((iso) => ({
          label: formatDayLabel(iso),
          value: pickValue(byDate.get(iso) ?? { date: iso }),
        })),
      };
    });

  const revenueByEmployee = useMemo<LineSeries[]>(
    () =>
      buildSeries((d) => d.netRevenue ?? d.grossRevenue ?? 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [byBilledBy, dayKeys],
  );

  const bookingByEmployee = useMemo<LineSeries[]>(
    () => buildSeries((d) => d.orders ?? 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [byBilledBy, dayKeys],
  );

  // Single aggregated total line for the top two cards.
  // Sums all employees on each day so filters still affect the total.
  const sumDaily = (
    pickValue: (entry: DailyEntry) => number,
  ): { label: string; value: number }[] => {
    const totals = new Map<string, number>();
    byBilledBy.forEach((entry) => {
      (entry.daily ?? []).forEach((d) => {
        totals.set(d.date, (totals.get(d.date) ?? 0) + pickValue(d));
      });
    });
    return dayKeys.map((iso) => ({
      label: formatDayLabel(iso),
      value: totals.get(iso) ?? 0,
    }));
  };

  const revenueTotalPoints = useMemo(
    () => sumDaily((d) => d.netRevenue ?? d.grossRevenue ?? 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [byBilledBy, dayKeys],
  );

  const bookingTotalPoints = useMemo(
    () => sumDaily((d) => d.orders ?? 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [byBilledBy, dayKeys],
  );

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

  const handleBilledByChange = (value: string) => {
    setBilledBy(value === "__all__" ? "" : value);
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
    xLabels,
    revenueTotalPoints,
    bookingTotalPoints,
    revenueByEmployee,
    bookingByEmployee,
    statisticsBreadCrumb,
    isOrgAdmin,
    orgUserOptions,
    billedBy,
    handleBilledByChange,
  };
};
