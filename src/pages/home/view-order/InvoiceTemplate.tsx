import React from "react";
import { Banknote, Mail, MapPin, Phone } from "lucide-react";
import { formatStringDate, formatAddress } from "@/lib/utils";
import CustomTable from "@/components/ui/Table";

export interface InvoiceTemplateProps {
  bookingData: any;
  allProductData: any[];
  columns: any[];
  isLoading?: boolean;
  showDownloadButton?: boolean;
  downloadButton?: React.ReactNode;
  containerClassName?: string;
  logoBlobUrl?: string;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  bookingData,
  allProductData,
  columns,
  isLoading = false,
  showDownloadButton = false,
  downloadButton,
  containerClassName = "",
  logoBlobUrl,
}) => {
  if (!bookingData) return null;
  return (
    <div className={`${containerClassName}print:p-0 print:bg-white`}>
      <div className="flex items-start justify-between">
        <div className="flex min-h-[100px] items-start gap-4 rounded-md">
          <div className="!grid !aspect-square !place-items-center !content-center !items-center !justify-center pb-5 print:pb-5">
            {bookingData?.organizationId?.logo ? (
              <img
                src={logoBlobUrl}
                alt="logo"
                className="h-[70px] w-[70px] rounded-full print:h-[70px] print:w-[70px]"
                id="invoice-logo"
              />
            ) : (
              <span className="text-md h-[70px] w-[70px] rounded-full border border-[#4D4D4D] pt-3.5 text-center font-semibold print:pb-0 print:pt-5">
                Logo
              </span>
            )}
          </div>
          <div className="-mt-2 flex flex-col items-start gap-1 print:mt-0">
            <span className="text-[18px] font-semibold">
              {bookingData?.organizationId?.organizationName}
            </span>
            <div className="flex flex-col items-start gap-1 text-xs font-medium text-[#000000]">
              <span className="flex items-center gap-1">
                <Mail size={14} strokeWidth={1.5} className="font-normal" />
                <div className="break-words pb-3.5 text-xs font-normal print:pb-0">
                  {bookingData?.organizationId?.email || "No Email Found"}
                </div>
              </span>
              <span className="-mt-3.5 flex items-center gap-1 font-normal text-[#000000] print:mt-0">
                <Banknote size={14} strokeWidth={1.5} className="font-normal" />
                <div className="break-words pb-3.5 text-xs font-normal print:pb-0">
                  {bookingData?.organizationId?.gstNumber ||
                    "No GST Number Found"}
                </div>
              </span>
              <span className="-mt-3.5 flex items-center gap-1 font-normal text-[#000000] print:mt-0">
                <Phone size={14} strokeWidth={1.5} className="font-normal" />
                <div className="break-words pb-3.5 text-xs font-normal print:pb-0">
                  {bookingData?.organizationId?.contactNumber
                    ? `+91 ${bookingData.organizationId.contactNumber}`
                    : "No Contact No Found"}
                </div>
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="ml-4 flex items-start gap-1">
          <MapPin size={14} strokeWidth={1.5} className="font-normal" />
          <div className="!ml-0.5 -mt-[8px] w-[156px] break-words text-xs font-normal text-[#000000] print:m-[-3px] print:pt-0">
            {formatAddress(bookingData?.organizationId?.address || "").map(
              (line, index) => (
                <span key={index}>{line}</span>
              ),
            )}
          </div>
        </div>

        {showDownloadButton && downloadButton}
      </div>

      {/* Customer Info */}
      <div className="flex flex-col items-end  rounded-lg border p-[16px]">
        <div className="items-between flex h-[59px] w-[730px] justify-between rounded-md">
          <div className="h-[48px]">
            <div className="text-xs font-medium text-[#4D4D4D]">Billed To</div>
            <div className="mb-1 text-base font-semibold leading-[18px] text-[#000000]">
              {bookingData?.customer?.customerName}
            </div>
            <div className="text-xs font-medium">
              {bookingData?.customer?.gstNumber}
            </div>
          </div>
          <div className="boredr flex justify-between border-black">
            <div className="items-between flex flex-col">
              <div className="text-xs font-medium text-[#4D4D4D]">#Invoice</div>
              <div className="text-xs font-medium">
                {bookingData?.invoiceNumber}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="text-xs font-medium text-[#4D4D4D]">Date</div>
            <div className="text-xs font-medium">
              {bookingData ? formatStringDate(bookingData?.createdAt) : ""}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mx-1 mt-[32px] flex min-h-[500px] w-[740px] justify-between text-[5px] print:min-h-[500px] print:w-[740px] [&_.table-container]:w-[740px] [&_.table-container]:!overflow-visible [&_.table-head]:w-auto [&_td]:pb-4 [&_td]:text-xs print:[&_td]:pb-1 [&_th]:pb-4 [&_th]:text-xs print:[&_th]:pb-1">
          {allProductData.length > 0 ? (
            <CustomTable
              columns={columns}
              data={allProductData.map((item, index) => ({
                ...item,
                index: index + 1,
              }))}
              isLoading={isLoading}
            />
          ) : (
            <div className="text-center text-sm text-gray-500">
              No products found.
            </div>
          )}
        </div>

        {/* Amount Section */}
        <div className="mt-4 flex w-full justify-end items-stretch gap-14">
          <div className="flex w-[230px] flex-col items-center justify-center gap-1 rounded-md border px-4 py-2 print:pt-4">
            <div className="flex w-full flex-row justify-between">
              {"  "}
              <span className="text-sm font-medium text-[#4D4D4D]">
                Amount:
              </span>
              {"  "}
              <span className="flex items-center text-sm font-semibold text-[#000000]">
                <span className="mr-[1px]">₹</span>
                {(
                  bookingData?.amount /
                  (1 + bookingData?.gstRate / 100)
                ).toLocaleString("en-IN", {
                  maximumFractionDigits: 3,
                })}
              </span>
            </div>
            <div className="flex w-full flex-row justify-between">
              <span className="text-sm font-medium text-[#4D4D4D]">CGST:</span>
              <span className="flex items-center text-sm font-semibold text-[#E58E02]">
                <span className="mr-[1px]">₹</span>
                {(
                  (bookingData?.amount -
                    bookingData?.amount / (1 + bookingData?.gstRate / 100)) *
                  0.5
                )?.toLocaleString("en-IN", {
                  maximumFractionDigits: 3,
                })}
              </span>
            </div>
            <div className="flex w-full flex-row justify-between">
              <span className="text-sm font-medium text-[#4D4D4D]">SGST:</span>
              <span className="flex items-center text-sm font-semibold text-[#E58E02]">
                <span className="mr-[1px]">₹</span>
                {(
                  (bookingData?.amount -
                    bookingData?.amount / (1 + bookingData?.gstRate / 100)) *
                  0.5
                )?.toLocaleString("en-IN", {
                  maximumFractionDigits: 3,
                })}
              </span>
            </div>
            <div className="mb-2 flex w-full flex-row justify-between print:mb-0">
              <span className="pb-1 text-sm font-medium text-[#4D4D4D] print:p-0">
                Total:
              </span>
              <span className="flex items-center text-sm font-semibold text-[#000000]">
                <span className="mr-[1px]">₹</span>
                {(Number(bookingData?.amount) || 0).toLocaleString("en-IN", {
                  maximumFractionDigits: 3,
                })}
              </span>
            </div>
          </div>
        </div>
        {/* Rules Section */}
        <div className="flex w-full justify-between gap-4 print:flex-col print:gap-0">
          <div className="w-full">
            <div className="flex items-center gap-2 print:mt-4 print:gap-3">
              <span className="block whitespace-nowrap text-xs font-semibold text-black">
                Special Notes
              </span>
              <hr className="mt-4 h-[1px] w-full bg-[#F2F2F2] print:mt-0.5" />
            </div>
            <ul className="flex flex-col gap-1.5 pt-2 font-medium leading-snug text-black">
              {bookingData?.organizationId?.billingRules?.length > 0 ? (
                bookingData?.organizationId?.billingRules?.map(
                  (rule: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-[7px] h-1.5 min-h-1.5 w-1.5 min-w-1.5 rounded-full bg-black print:mt-0.5"></div>
                      <span className="text-[8px]"> {rule}</span>
                    </li>
                  ),
                )
              ) : (
                <li className="flex items-start gap-2">
                  <div className="mt-[7px] h-1.5 min-h-1.5 w-1.5 min-w-1.5 rounded-full bg-black print:mt-0.5"></div>
                  <span className="text-[8px]">No rules defined.</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center pt-3 text-xs font-medium text-[#000000] print:pb-8 print:pt-3">
        Thanks You Visit Again!
      </div>
    </div>
  );
};

export default InvoiceTemplate;
