import { ROUTES } from "@/constants";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useReservedProducts } from "../../reserved-products/hooks/useReservedProducts";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { formatINR } from "@/lib/utils";

export const ordersColums = (handleOrder: (id: string) => void) => {
  const { setSelectedData, setSelectedProduct } = useReservedProducts();

  return [
    {
      header: "Invoice No.",
      accessor: "invoiceNumber",
      renderCell: (value: string) => value || "-",
    },
    {
      header: "Booking Date",
      accessor: "createdAt",
      renderCell: (value: string) => {
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      header: "Customer Name",
      accessor: "customer.customerName",
      renderCell: (value: string) => (
        <Tooltip>
          <TooltipTrigger>
            {value.length > 20 ? `${value.slice(0, 20)}...` : value}
          </TooltipTrigger>
          {value.length > 20 && (
            <TooltipContent className="rounded-md bg-gray-800 p-2 text-xs text-white">
              {value}
            </TooltipContent>
          )}
        </Tooltip>
      ),
    },
    {
      header: "Mobile No.",
      accessor: "customer.phoneNumberPrimary",
    },
    {
      header: "Alternate No.",
      accessor: "customer.phoneNumberSecondary",
      renderCell: (value: string) => (value?.trim() === "" ? "N/A" : value),
    },

    {
      header: "Amount",
      accessor: "amount",
      renderCell: (value: number) => formatINR(value),
    },
    {
      header: "Action",
      accessor: "actions",
      renderCell: (_: any, rowData: any) => {
        const now = new Date();
        const createdAt = new Date(rowData?.createdAt);
        const isSameDay =
          now.getFullYear() === createdAt.getFullYear() &&
          now.getMonth() === createdAt.getMonth() &&
          now.getDate() === createdAt.getDate();
        return (
          <div className="flex w-[80px] gap-2.5">
            <Link
              to={`${ROUTES.VIEW_ORDER.replace(":id", rowData._id as string)}`}
            >
              <Tooltip>
                <TooltipTrigger>
                  <Eye
                    id="View"
                    size={20}
                    strokeWidth={1}
                    className="mt-1 cursor-pointer rounded-md text-black hover:bg-gray-200"
                  />
                </TooltipTrigger>
                <TooltipContent className="mb-2">
                  <span className="rounded-md bg-gray-800 p-2 text-xs font-normal text-white">
                    View Product
                  </span>
                </TooltipContent>
              </Tooltip>
            </Link>
            {isSameDay && (
              <>
                <Tooltip>
                  <TooltipTrigger>
                    <Edit
                      id="Edit"
                      className="cursor-pointer rounded-md text-black hover:bg-gray-200"
                      size={20}
                      strokeWidth={1}
                      onClick={() => {
                        setSelectedData(rowData);
                        setSelectedProduct(rowData._id as string);
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="mb-2">
                    <span className="rounded-md bg-gray-800 p-2 text-xs font-normal text-white">
                      Edit Product
                    </span>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <Trash2
                      id="Delete"
                      className="cursor-pointer rounded-md text-black hover:bg-gray-200"
                      onClick={() => handleOrder(String(rowData._id))}
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
              </>
            )}
          </div>
        );
      },
    },
  ];
};
