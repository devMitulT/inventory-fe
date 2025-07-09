import { formatINR } from "@/lib/utils";
export const viewOrderBreadCrumb = ["Orders", "View"];
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
export const billProductColumns = () => [
  {
    header: "#",
    accessor: "index",
    renderCell: (value: any) => `${value}`,
  },
  {
    header: "Product Name",
    accessor: "productId",
    renderCell: (value: any) => {
      const displayText = `${value?.sku} : ${value?.name}`;
      const displaylength =
        displayText.length > 80
          ? `${displayText.slice(0, 80)}...`
          : displayText;

      return (
        <Tooltip>
          <TooltipTrigger>{displaylength}</TooltipTrigger>
          {displayText.length > 80 && (
            <TooltipContent className="rounded-md bg-gray-800 p-2 text-xs text-white">
              {displayText}
            </TooltipContent>
          )}
        </Tooltip>
      );
    },
  },

  {
    header: "Per Unit Cost",
    accessor: "perUnitCost",
    renderCell: (value: number) => formatINR(value),
  },
  {
    header: "Unit",
    accessor: "unit",
    renderCell: (value: number) => value,
  },
  {
    header: "Total",
    accessor: "total",
    renderCell: (_: any, row: { unit: number; perUnitCost: number }) =>
      formatINR((row.unit || 0) * (row.perUnitCost || 0)),
  },
];

export const billColumns = () => [
  {
    header: "#",
    accessor: "index",
    renderCell: (value: any) => `${value}`,
  },
  {
    header: "Product Name",
    accessor: "productId",
    renderCell: (value: any) => {
      if (!value) return "-";
      const displayText = `${value.sku} : ${value.name}`;
      const displaylength =
        displayText.length > 50
          ? `${displayText.slice(0, 50)}...`
          : displayText;

      return (
        <Tooltip>
          <TooltipTrigger>{displaylength}</TooltipTrigger>
          {displayText.length > 50 && (
            <TooltipContent className="rounded-md bg-gray-800 p-2 text-xs text-white">
              {displayText}
            </TooltipContent>
          )}
        </Tooltip>
      );
    },
  },
  {
    header: "Per Unit Cost",
    accessor: "perUnitCost",
    renderCell: (value: number) => formatINR(value),
  },
  {
    header: "Unit",
    accessor: "unit",
    renderCell: (value: number) => value,
  },
  {
    header: "Total",
    accessor: "total",
    renderCell: (_: any, row: { unit: number; perUnitCost: number }) =>
      formatINR((row.unit || 0) * (row.perUnitCost || 0)),
  },
];
