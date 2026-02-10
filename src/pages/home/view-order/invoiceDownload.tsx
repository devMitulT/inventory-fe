import { useEffect, useRef, useState } from "react";
import { Download, Loader, MapPin, Phone } from "lucide-react";
import { formatStringDate, formatAddress } from "@/lib/utils";
import CustomTable from "@/components/ui/Table";
import { useGetBookingById } from "@/services/queries";
import { useParams } from "react-router-dom";
import { billColumns } from "./constants";
import { generatePDF } from "@/lib/pdfUtils";
import InvoiceTemplate from "./InvoiceTemplate";

const InvoiceDownload = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [allProductData, setAllProductData] = useState<any[]>([]);
  const {
    data: fetchedBookingData,
    isLoading,
    isError,
  } = useGetBookingById(bookingId as string);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [logoBlobUrl, setLogoBlobUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchLogo = async () => {
      const logoUrl = fetchedBookingData?.data?.organizationId?.logo;
      if (logoUrl) {
        try {
          const response = await fetch(logoUrl);
          const blob = await response.blob();

          const reader = new FileReader();
          reader.onloadend = () => {
            setLogoBlobUrl(reader.result as string);
          };
          reader.readAsDataURL(blob); // This converts blob to base64
        } catch (error) {
          console.error("Failed to fetch or convert logo:", error);
        }
      }
    };
    fetchLogo();
  }, [fetchedBookingData]);
  const handleDownload = async () => {
    if (invoiceRef.current) {
      await generatePDF(invoiceRef.current, "InvoiceReciept.pdf");
    }
  };

  useEffect(() => {
    if (fetchedBookingData?.data?.products) {
      setAllProductData(fetchedBookingData.data.products);
    }
  }, [fetchedBookingData]);

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span>Please Wait...</span>
        <Loader height={25} width={25} />
      </div>
    );
  if (isError || !fetchedBookingData)
    return <div>Error loading booking data.</div>;
  if (!bookingId) return <div>Error: No booking ID found in URL.</div>;

  const bookingData = fetchedBookingData.data;

  return (
    <div className="mx-auto max-w-[500px] bg-white p-4 print:pb-0">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:items-start">
        <div className="flex max-w-full items-center gap-6 md:max-w-[377px]">
          <div>
            {bookingData?.organizationId?.logo ? (
              <img
                src={bookingData.organizationId.logo}
                alt="logo"
                className="flex h-[65px] w-[67px] items-center justify-center rounded-full border"
              />
            ) : (
              <span className="text-md rounded-full border border-[#4D4D4D] pb-6 pl-4 pr-3 pt-[21px] font-semibold">
                Logo
              </span>
            )}
          </div>
          <div className="flex w-[302px] flex-col justify-center gap-1.5">
            <span className="text-sm font-semibold">
              {bookingData?.organizationId?.organizationName}
            </span>
            <div className="flex flex-col gap-1.5 text-xs font-medium text-[#000000]">
              <div className="flex items-center gap-1 font-medium text-[#000000]">
                <Phone size={13} />
                {bookingData?.organizationId?.contactNumber
                  ? `+91 ${bookingData.organizationId.contactNumber}`
                  : "No Contact Number Found"}
              </div>
              <div className="flex items-center gap-1 font-medium text-[#000000]">
                GSTIN :{" "}
                {bookingData?.organizationId?.gstNumber
                  ? `${bookingData.organizationId.gstNumber}`
                  : "No GST Number Found"}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-0.5 text-xs font-medium">
              <MapPin size={16} className="min-h-3 min-w-3 pb-[1px]" />
              <div className="text-[#000000]">
                {formatAddress(bookingData?.organizationId?.address || "").map(
                  (line, index) => (
                    <div key={index}>{line}</div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mt-4 flex flex-col justify-end itmes-end gap-4 border-t py-[15px]">
        <div className="flex flex-row justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-[#4D4D4D]">Billed To</div>
            <div className="mb-1 text-base font-semibold leading-[18px] text-[#000000]">
              {bookingData?.customer?.customerName}
            </div>
            {bookingData?.customer?.gstNumber && (
              <div className="text-xs font-medium">
                GSTIN : {bookingData?.customer?.gstNumber}
              </div>
            )}
          </div>
          <div className="text-xs">
            <div className="font-medium text-[#4D4D4D]">#Invoice</div>
            <div className="text-xs font-medium">
              {bookingData?.invoiceNumber}
            </div>
          </div>
          <div className="text-xs">
            <div className="font-medium text-[#4D4D4D]">Date</div>
            <div className="text-xs font-medium">
              {bookingData ? formatStringDate(bookingData?.createdAt) : ""}
            </div>
          </div>
          <button
            onClick={handleDownload}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#EDEDED] font-medium text-[#1EB386]"
          >
            <Download size={14} />
          </button>
        </div>

        {/* Table */}
        <div className="mt-2 max-w-full overflow-auto [&_.table-container]:w-[calc(100vw_-_32px)] [&_.table-container]:max-w-[468px] [&_.table-head:first-child]:hidden [&_.table-head:nth-child(2)]:w-[137px] [&_.table-head]:px-2 [&_td:first-child]:hidden [&_td]:h-[32px] [&_td]:w-fit [&_td]:max-w-[137px] [&_td]:border-dotted [&_td]:px-2 [&_td]:text-left [&_td]:text-xs [&_td_button]:text-left [&_th]:h-[32px] [&_th]:w-fit [&_th]:max-w-[137px] [&_th]:pt-2 [&_th]:text-left [&_th]:text-xs [&_thead]:h-fit [&_tr]:h-fit">
          {allProductData.length > 0 ? (
            <CustomTable
              columns={billColumns()}
              data={allProductData.map((item, index) => ({
                ...item,
                index: index + 1,
              }))}
            />
          ) : (
            <div className="text-center text-sm text-gray-500">
              No products found.
            </div>
          )}
        </div>

        {/* Amount Section */}
        <div className="mt-[18px] flex items-end justify-end gap-5">
          <div className="flex w-[230px] flex-col items-end justify-end rounded-md border p-2">
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
            {bookingData?.gstRate > 0 && (
              <div className="flex w-full flex-row justify-between">
                <span className="text-sm font-medium text-[#4D4D4D]">
                  CGST:
                </span>
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
            )}
            {bookingData?.gstRate > 0 && (
              <div className="flex w-full flex-row justify-between">
                <span className="text-sm font-medium text-[#4D4D4D]">
                  SGST:
                </span>
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
            )}
            {Number(bookingData?.discountAmount) > 0 && (
              <div className="flex w-full flex-row justify-between">
                <span className="text-sm font-medium text-[#4D4D4D]">
                  Discount:
                </span>
                <span className="flex items-center text-sm font-semibold text-green-500">
                  <span className="mr-[1px]">- ₹</span>
                  {Number(bookingData?.discountAmount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex w-full flex-row justify-between print:mb-0">
              <span className="pb-1 text-sm font-medium text-[#4D4D4D] print:p-0">
                Total:
              </span>
              <span className="flex items-center text-sm font-semibold text-[#000000]">
                <span className="mr-[1px]">₹</span>
                {(
                  Number(bookingData?.amount) -
                    Number(bookingData?.discountAmount) || 0
                ).toLocaleString("en-IN", {
                  maximumFractionDigits: 3,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <div className="w-full">
          <div className="flex items-center gap-2">
            <span className="block whitespace-nowrap text-xs font-semibold text-black">
              Special Notes
            </span>
            <hr className="mt-0.5 h-[1px] w-full bg-[#F2F2F2] print:mt-0" />
          </div>
          <ul className="flex flex-col gap-1.5 pt-2 font-medium leading-snug text-black">
            {fetchedBookingData?.data?.organizationId?.billingRules.length >
            0 ? (
              fetchedBookingData?.data?.organizationId?.billingRules.map(
                (rule: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-[2.5px] h-1.5 min-h-1.5 w-1.5 min-w-1.5 rounded-full bg-black"></div>
                    <span className="text-[8px]">{rule}</span>
                  </li>
                ),
              )
            ) : (
              <li className="flex items-start gap-2">
                <div className="mt-[2.5px] h-1.5 min-h-1.5 w-1.5 min-w-1.5 rounded-full bg-black"></div>
                <span className="text-[8px]">No notes defined.</span>
              </li>
            )}
          </ul>
        </div>
        <div className="flex items-center justify-center pb-0 pt-0.5 text-xs font-medium text-[#000000]">
          Thanks You Visit Again!
        </div>
      </div>

      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <div ref={invoiceRef} className="px-4 py-6 pb-5 print:pb-0">
          {bookingData && (
            <InvoiceTemplate
              bookingData={bookingData}
              allProductData={allProductData || []}
              columns={billColumns()}
              showDownloadButton={true}
              logoBlobUrl={logoBlobUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDownload;
