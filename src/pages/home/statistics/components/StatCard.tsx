import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

const StatCard = ({ label, value, icon: Icon }: StatCardProps) => {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-[#4D4D4D]">{label}</span>
        <span className="text-2xl font-semibold text-[#000000]">{value}</span>
      </div>
      <div className="flex h-12 w-12 items-center justify-center text-[#D1D1D1]">
        <Icon className="h-9 w-9" strokeWidth={1.25} />
      </div>
    </div>
  );
};

export default StatCard;
