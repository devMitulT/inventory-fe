import { Edit } from "lucide-react";
import { Link } from "react-router-dom";

import { useViewProductDetails } from "./hooks/useViewProductDetail";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip/tooltip";
import BreadcrumbWrapper from "@/components/ui/Breadcrumb";
import { Separator } from "@/components/ui/Separator/separator";
import { ROUTES } from "@/constants";

const ViewProductDetails = () => {
  const { isLoading, product, viewProductBreadCrumb } = useViewProductDetails();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mt-72 flex items-center justify-center p-2">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-gray-500"></div>
        </div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between pe-5">
        <BreadcrumbWrapper routes={viewProductBreadCrumb} />
        <Link
          className="cursor-pointer"
          to={`${ROUTES.EDIT_PRODUCT.replace(":id", product?._id as string)}`}
        >
          <Tooltip>
            <TooltipTrigger>
              <Edit
                id="Edit"
                size={20}
                strokeWidth={1}
                className="rounded-md hover:bg-gray-200"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Product</p>
            </TooltipContent>
          </Tooltip>
        </Link>
      </div>

      {product && (
        <div className="m-4 grid grid-cols-1 gap-8 rounded-md bg-white px-10 py-7 md:grid-cols-3">
          <div className="col-span-2 p-2">
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-gray-800">
                {product?.name}
              </div>
              <div className="text-sm text-[#8C8C8C]">
                {product?.description}
              </div>
              <div className="text-[18px] font-semibold">
                ₹
                {Number(product?.perUnitCost)?.toLocaleString("en-IN", {
                  maximumFractionDigits: 3,
                })}{" "}
                (per unit)
              </div>
              <Separator />
            </div>

            <div className="flex gap-4 py-4">
              <div className="flex flex-col justify-between">
                <span className="pb-1 text-sm font-normal text-[#4D4D4D]">
                  SKU
                </span>
                <span className="rounded-md border bg-gray-100 px-4 py-[6.5px] text-sm font-medium">
                  {product?.sku}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="pb-1 text-sm font-normal text-[#4D4D4D]">
                  Colour
                </span>
                <span className="rounded-md border bg-gray-100 px-4 py-[6.5px] text-sm font-medium">
                  {product.colour}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="pb-1 text-sm font-normal text-[#4D4D4D]">
                  Stock
                </span>
                <span className="rounded-md border bg-gray-100 px-4 py-[6.5px] text-sm font-medium">
                  {product?.stock}
                </span>
              </div>

              <div className="flex flex-col justify-between">
                <span className="pb-1 text-sm font-normal text-[#4D4D4D]">
                  Threshold Stock
                </span>
                <span className="rounded-md border bg-gray-100 px-4 py-[6.5px] text-sm font-medium">
                  {product?.thresholdStock}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="pb-1 text-sm font-normal text-[#4D4D4D]">
                  Measurment Type
                </span>
                <span className="rounded-md border bg-gray-100 px-4 py-[6.5px] text-sm font-medium">
                  {product?.measurementType}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProductDetails;
