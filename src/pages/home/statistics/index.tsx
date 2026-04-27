import { format } from "date-fns";
import { Calendar, CalendarDays, Wallet } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { useStatistics } from "./hooks/useStatistics";
import { useVerifyAccess } from "./hooks/useVerifyAccess";
import { dateRangeOptions } from "./constants";
import StatCard from "./components/StatCard";
import LineChart from "./components/LineChart";
import VerifyPasswordModal from "./components/VerifyPasswordModal";

const formatMoney = (n: number) =>
  n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Statistics = () => {
  const {
    email,
    isVerified,
    isVerifying,
    errorMessage,
    handleVerify,
    handleCancel,
  } = useVerifyAccess();

  const {
    option,
    customFrom,
    customTo,
    handleOptionChange,
    handleFromChange,
    handleToChange,
    totalBooking,
    totalRevenue,
    revenuePoints,
    bookingPoints,
  } = useStatistics();

  const isCustom = option === "custom";

  if (!isVerified) {
    return (
      <VerifyPasswordModal
        open
        email={email}
        onCancel={handleCancel}
        onVerify={handleVerify}
        isVerifying={isVerifying}
        errorMessage={errorMessage}
      />
    );
  }

  return (
    <div className="pb-6">


      <div className="mx-6   p-6 ">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-md font-semibold text-[#000000]">Statistics</h2>
          <div className="flex items-center gap-3">
            <Select value={option} onValueChange={handleOptionChange}>
              <SelectTrigger
                id="statsRangeFilter"
                className="h-8 w-[180px] rounded-md border bg-white px-2 font-medium"
              >
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  {dateRangeOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="hover:cursor-pointer"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {isCustom && (
              <>
                <DatePicker
                  month={customFrom ?? new Date()}
                  selectedValue={customFrom}
                  onSelect={(d) => handleFromChange(d ?? undefined)}
                >
                  <Button
                    id="statsFromDate"
                    variant="outline"
                    className={cn(
                      "h-8 w-[186px] pl-3 text-left font-medium",
                      !customFrom && "text-muted-foreground",
                    )}
                  >
                    {customFrom ? (
                      `From : ${format(customFrom, "dd/MM/yyyy")}`
                    ) : (
                      <span>From date</span>
                    )}
                    <CalendarDays className="ml-auto h-4 w-4 opacity-100" />
                  </Button>
                </DatePicker>

                <DatePicker
                  month={customTo ?? customFrom ?? new Date()}
                  selectedValue={customTo}
                  onSelect={(d) => handleToChange(d ?? undefined)}
                  disabled={(dat) =>
                    customFrom ? dat < customFrom : false
                  }
                >
                  <Button
                    id="statsToDate"
                    variant="outline"
                    className={cn(
                      "h-8 w-[186px] pl-3 text-left font-medium",
                      !customFrom && "text-muted-foreground",
                    )}
                    disabled={!customFrom}
                  >
                    {customTo ? (
                      `To : ${format(customTo, "dd/MM/yyyy")}`
                    ) : (
                      <span>To date</span>
                    )}
                    <CalendarDays className="ml-auto h-4 w-4 opacity-100" />
                  </Button>
                </DatePicker>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Booking"
            value={totalBooking}
            icon={Calendar}
          />
          <StatCard
            label="Total Revenue"
            value={formatMoney(totalRevenue)}
            icon={Wallet}
          />
         
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <LineChart title="Revenue Overview" points={revenuePoints} />
          <LineChart title="Booking Overview" points={bookingPoints} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
