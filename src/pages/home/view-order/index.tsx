import BreadcrumbWrapper from "@/components/ui/Breadcrumb";
import { Download, Edit, Printer } from "lucide-react";
import { viewOrderBreadCrumb } from "./constants";
import { Button } from "@/components/ui/Button";
import { useViewOrder } from "./hooks/useViewOrder";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import Icons from "@/assets/icons";

import { useReservedProducts } from "../reserved-products/hooks/useReservedProducts";
import { formatStringDate } from "@/lib/utils";
import CustomTable from "@/components/ui/Table";
import InvoiceTemplate from "./InvoiceTemplate";

function ViewOrder() {
  const {
    allProductData,
    bookingData,
    columns,
    billColumn,
    isBookingLoading,
    invoiceRef,
    handleShareOnWhatsapp,
    handleDownloadPDF,
    handlePrint,
    logoBlobUrl,
  } = useViewOrder();

  const { setSelectedData, setSelectedProduct } = useReservedProducts();

  const now = new Date();
  const earliestDate = new Date(
    Math.min(
      ...(bookingData?.data?.products || [])
        .map((p: any) => new Date(p.deliveryDate))
        .filter((d: any) => !isNaN(d)),
    ),
  );
  const isDisable = earliestDate < now;
  return (
    <div className="mt-6 min-h-[777px]">
      <div className="flex h-[32px] items-center justify-between pr-6">
        <BreadcrumbWrapper routes={viewOrderBreadCrumb} />
        <div className="flex items-center justify-between gap-[12px]">
          <Button
            id="shareWhatsapp"
            onClick={handleShareOnWhatsapp}
            type="button"
            className="w-[211px] rounded-md border border-[#EDEDED] py-0 text-[14px] font-medium text-[#39AE41] hover:bg-gray-50"
          >
            <Icons.whatsapp />
            Share on Whatsapp
          </Button>
          <Button
            id="generatePrint"
            variant="outline"
            type="button"
            onClick={() => handlePrint?.()}
            className="h-8 w-[140px] rounded-lg border border-[#EDEDED] text-[14px] font-medium hover:bg-gray-50"
          >
            <Printer size={24} />
            Print Invoice
          </Button>
          <Button
            id="generatePdf"
            onClick={handleDownloadPDF}
            type="button"
            className="h-8 w-[140px] rounded-md border border-[#EDEDED] text-[14px] font-medium text-[#1EB386] hover:bg-gray-50"
          >
            <Download size={24} />
            Download
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="rounded-lg bg-white p-8">
          <div className="">
            <div className="flex justify-between pb-4">
              <span className="rounded-sm bg-[#F2F2F2] px-2 py-1.5 text-[16px] font-medium">
                Invoice #&nbsp;{bookingData?.data?.invoiceNumber}
              </span>
              {!isDisable && (
                <Tooltip>
                  <TooltipTrigger>
                    <Edit
                      id="Edit"
                      className="cursor-pointer rounded-md hover:bg-gray-200"
                      size={22}
                      strokeWidth={1.5}
                      onClick={() => {
                        setSelectedData(bookingData?.data);
                        setSelectedProduct(bookingData?.data?._id as string);
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="">
                    <span className="rounded-md bg-gray-800 p-2 text-xs font-normal text-white">
                      Edit Product
                    </span>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex w-full flex-col items-end rounded-md border border-[#E0E2E7] p-4">
              <div className="flex w-full items-center justify-between rounded-md border-b p-4">
                <div className="h-[48px] w-[481px]">
                  <div className="text-md font-semibold">
                    {bookingData?.data?.customer?.customerName}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-[#4D4D4D]">
                    <span>
                      {bookingData?.data?.customer?.phoneNumberPrimary}
                    </span>
                    {bookingData?.data?.customer?.phoneNumberSecondary?.trim() !==
                      "" && (
                      <>
                        <span>&nbsp;|&nbsp;</span>
                        <span>
                          {bookingData?.data?.customer?.phoneNumberSecondary}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-[#4D4D4D]">
                    GSTIN : {bookingData?.data?.customer?.gstNumber}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  {/* Date Box */}
                  <div className="flex h-[33px] w-[105px] items-center justify-center rounded-md bg-[#EDEDED]">
                    <div className="text-sm font-medium text-[#4D4D4D]">
                      {bookingData
                        ? formatStringDate(bookingData?.data?.createdAt)
                        : ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-[32px]  flex h-[475px] justify-between rounded-lg lg:[&_.table-container]:w-[calc(100vw_-_410px)] [&_.table-head]:w-auto">
                <CustomTable
                  columns={columns}
                  data={
                    allProductData?.map((item, index) => ({
                      ...item,
                      index: index + 1,
                    })) || []
                  }
                  isLoading={isBookingLoading}
                />
              </div>
              <div className="mt-4 flex h-auto w-full items-stretch justify-end gap-6  mb-5">
                <div className="ml-0 mr-5 flex w-full justify-start rounded-lg border px-4 py-2 text-justify">
                  <div className="flex justify-start gap-1">
                    <span className="text-sm font-semibold text-[#4D4D4D]">
                      Notes:{" "}
                    </span>
                    <div className="max-h-20 py-[3px] text-xs font-medium text-[#4D4D4D]">
                      {bookingData?.data?.notes?.trim()
                        ? bookingData.data.notes
                        : "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex rounded-lg border">
                  <div className="flex w-[230px] flex-col justify-between gap-0.5">
                    <div className="flex flex-row justify-between px-4 pt-[7px]">
                      {"  "}
                      <span className="text-sm font-medium text-[#4D4D4D]">
                        Amount:
                      </span>
                      {"  "}
                      <span className="text-sm font-semibold text-[#000000]">
                        ₹
                        {(
                          bookingData?.data?.amount /
                          (1 + bookingData?.data?.gstRate / 100)
                        ).toLocaleString("en-IN", {
                          maximumFractionDigits: 3,
                        })}
                      </span>
                    </div>
                    {bookingData?.data?.gstRate > 0 && (
                      <div className="flex flex-row justify-between px-4 py-0.5">
                        <span className="text-sm font-medium text-[#4D4D4D]">
                          CGST:
                        </span>
                        <span className="text-sm font-semibold text-[#E58E02]">
                          ₹
                          {(
                            (bookingData?.data?.amount -
                              bookingData?.data?.amount /
                                (1 + bookingData?.data?.gstRate / 100)) *
                            0.5
                          )?.toLocaleString("en-IN", {
                            maximumFractionDigits: 3,
                          })}
                        </span>
                      </div>
                    )}
                    {bookingData?.data?.gstRate > 0 && (
                      <div className="flex flex-row justify-between px-4 py-0.5">
                        <span className="text-sm font-medium text-[#4D4D4D]">
                          SGST:
                        </span>
                        <span className="text-sm font-semibold text-[#E58E02]">
                          ₹
                          {(
                            (bookingData?.data?.amount -
                              bookingData?.data?.amount /
                                (1 + bookingData?.data?.gstRate / 100)) *
                            0.5
                          )?.toLocaleString("en-IN", {
                            maximumFractionDigits: 3,
                          })}
                        </span>
                      </div>
                    )}
                    {bookingData?.data?.discountAmount > 0 && (
                      <div className="flex flex-row justify-between px-4 py-0.5">
                        <span className="text-sm font-medium text-[#4D4D4D]">
                          Discount:
                        </span>
                        <span className="text-sm font-semibold text-green-500">
                          - ₹
                          {Number(bookingData?.data?.discountAmount).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-row justify-between rounded-[0_0_8px_8px] bg-[#FAFAFA] px-4 pb-[7px] pt-[2px]">
                      <span className="text-sm font-medium text-[#4D4D4D]">
                        Total:
                      </span>
                      <span className="text-sm font-semibold text-[#000000]">
                        ₹
                        {(
                          Number(bookingData?.data?.amount) -
                            Number(bookingData?.data?.discountAmount) || 0
                        ).toLocaleString("en-IN", {
                          maximumFractionDigits: 3,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {true && (
        <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
          <div
            ref={invoiceRef}
            className="px-4 py-6 pb-5 print:bg-white print:pb-0"
          >
            {bookingData && (
              <InvoiceTemplate
                bookingData={bookingData.data}
                allProductData={allProductData || []}
                columns={billColumn}
                isLoading={isBookingLoading}
                logoBlobUrl={logoBlobUrl}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewOrder;
