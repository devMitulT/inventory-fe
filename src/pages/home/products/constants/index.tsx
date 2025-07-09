import { ROUTES } from "@/constants";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { formatINR } from "@/lib/utils";
import ArchivedProductIcon from "@/assets/icons/archivedProduct";

export const productColums = (handleProductDelete: (id: string) => void) => [
  { header: "SKU", accessor: "sku" },
  {
    header: "Product Name",
    accessor: "name",
    renderCell: (value: string, rowData: Product) => (
      <Link
        className="text-blue-600 hover:underline"
        to={`${ROUTES.PRODUCT_DETAILS.replace(":id", rowData._id as string)}`}
      >
        <Tooltip>
          <TooltipTrigger>
            {value.length > 50 ? `${value.slice(0, 50)}...` : value}
          </TooltipTrigger>
          {value.length > 50 && (
            <TooltipContent className="rounded-md bg-gray-800 p-2 text-xs text-white">
              {value}
            </TooltipContent>
          )}
        </Tooltip>
      </Link>
    ),
  },
  {
    header: "Per Unit Cost",
    accessor: "perUnitCost",
    renderCell: (value: number) => formatINR(value),
  },
  {
    header: "Stock",
    accessor: "stock",
    renderCell: (value: number) => value,
  },
  {
    header: "Threshold stock",
    accessor: "thresholdStock",
    renderCell: (value: number) => value,
  },
  {
    header: "Measurement Unit",
    accessor: "measurementType",
    renderCell: (value: number) => value,
  },

  {
    header: "Action",
    accessor: "actions",
    renderCell: (_: any, rowData: Product) => (
      <div className="flex items-start justify-start gap-2">
        <Link
          to={`${ROUTES.EDIT_PRODUCT.replace(":id", rowData._id as string)}`}
        >
          <Tooltip>
            <TooltipTrigger>
              <Edit
                id="Edit"
                size={20}
                strokeWidth={1}
                onClick={() => handleProductDelete(String(rowData._id))}
                className="cursor-pointer rounded-md text-black hover:bg-gray-200"
              />
            </TooltipTrigger>
            <TooltipContent className="mb-2">
              <span className="rounded-md bg-gray-800 p-2 text-xs font-normal text-white">
                Edit Product
              </span>
            </TooltipContent>
          </Tooltip>
        </Link>
        <span className="text-black"> </span>
        <Tooltip>
          <TooltipTrigger>
            <Trash2
              id="Delete"
              className="cursor-pointer rounded-md text-black hover:bg-gray-200"
              onClick={() => handleProductDelete(String(rowData._id))}
              size={20}
              strokeWidth={1}
            />
          </TooltipTrigger>
          <TooltipContent className="mb-2">
            <span className="rounded-md bg-gray-800 p-2 text-xs font-normal text-white">
              Delete Product
            </span>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];

export const archivedColumns = (
  setProductToArchived: (id: string | null) => void
) => [
  { header: "SKU", accessor: "sku" },
  {
    header: "Product Name",
    accessor: "name",
    renderCell: (value: string, rowData: Product) => (
      <Link
        className="text-blue-600 hover:underline"
        to={`${ROUTES.PRODUCT_DETAILS.replace(":id", rowData._id as string)}`}
      >
        <Tooltip>
          <TooltipTrigger>
            {value.length > 50 ? `${value.slice(0, 50)}...` : value}
          </TooltipTrigger>
          {value.length > 50 && (
            <TooltipContent className="rounded-md bg-gray-800 p-2 text-xs text-white">
              {value}
            </TooltipContent>
          )}
        </Tooltip>
      </Link>
    ),
  },
  {
    header: "Per Unit Cost",
    accessor: "perUnitCost",
    renderCell: (value: number) => formatINR(value),
  },
  {
    header: "Stock",
    accessor: "stock",
    renderCell: (value: number) => value,
  },
  {
    header: "Threshold stock",
    accessor: "thresholdStock",
    renderCell: (value: number) => value,
  },
  {
    header: "Measurement Unit",
    accessor: "measurementType",
    renderCell: (value: number) => value,
  },

  {
    header: "Action",
    accessor: "actions",
    renderCell: (_: any, rowData: Product) => (
      <Tooltip>
        <TooltipTrigger>
          <ArchivedProductIcon
            id="archivedProduct"
            className="cursor-pointer rounded-md text-black hover:bg-gray-200"
            onClick={() => setProductToArchived(String(rowData._id))}
          />
        </TooltipTrigger>
        <TooltipContent className="mb-2">
          <span className="rounded-md bg-gray-800 p-2 text-xs font-normal text-white">
            Archived Product
          </span>
        </TooltipContent>
      </Tooltip>
    ),
  },
];
