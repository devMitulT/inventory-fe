import { billColumns, billProductColumns } from "../constants";
import { useGetBookingById } from "@/services/queries";
import { useReactToPrint } from "react-to-print";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

//@ts-ignore
import html2pdf from "html2pdf.js";
import "jspdf-autotable";
import { generatePDF } from "@/lib/pdfUtils";

export const useViewOrder = () => {
  const invoiceRef = useRef(null);
  const location = useLocation();
  const { toast } = useToast();
  const bookingId = location.pathname.split("/").pop();
  const columns = billProductColumns();
  const billColumn = billColumns();
  // State to store all product data
  const [allProductData, setAllProductData] = useState<any[]>([]);
  const [logoBlobUrl, setLogoBlobUrl] = useState<string | undefined>(undefined);
  const { data: bookingData, isLoading: isBookingLoading } = useGetBookingById(
    bookingId as string
  );

  useEffect(() => {
    if (bookingData?.data?.products) {
      setAllProductData(bookingData?.data?.products);
    }
  }, [bookingData]);

  useEffect(() => {
    const fetchLogo = async () => {
      const logoUrl = bookingData?.data?.organizationId?.logo;
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
  }, [bookingData]);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: "Document Title",
    onAfterPrint: () => console.log("Print successful"),
  });

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !bookingData?.data?._id) return;
    await generatePDF(
      invoiceRef.current,
      `Invoice ${bookingData?.data?.invoiceNumber as string}`
    );
  };

  const buildInvoiceMessage = () => {
    const data = bookingData?.data;
    const orgName =
      data?.organizationId?.organizationName || "Your Organization";
    const invoiceNumber = data?.invoiceNumber || "N/A";
    const orderId = data?._id;
    const appUrl = (
      import.meta.env.VITE_APP_URL || window.location.origin
    ).replace(/\/+$/, "");
    const receiptUrl = `${appUrl}/e-receipt/${orderId}`;

    return (
      `*Invoice Details:*\n` +
      `Bill From: *${orgName}*\n` +
      `Invoice Number: *${invoiceNumber}*\n\n` +
      `*Please find the invoice attached:*\n${receiptUrl}`
    );
  };

  const handleShareOnWhatsapp = () => {
    const message = buildInvoiceMessage();
    const rawPhone = bookingData?.data?.customer?.phoneNumberPrimary;

    if (rawPhone) {
      const whatsappUrl = `https://wa.me/+91${rawPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    } else {
      alert("Customer phone number is not available.");
    }
  };

  const handleCopyInvoice = async () => {
    if (!bookingData?.data?._id) return;
    const message = buildInvoiceMessage();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
      } else {
        // Fallback for older browsers / non-secure contexts
        const textarea = document.createElement("textarea");
        textarea.value = message;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast({
        title: "Copied to clipboard",
        description: "Invoice details copied. Paste it anywhere.",
        duration: 2000,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Could not copy to clipboard.";
      toast({
        title: "Copy failed",
        description: errorMessage,
        duration: 2000,
      });
    }
  };

  return {
    bookingData,
    allProductData,
    isBookingLoading,
    columns,
    billColumn,
    invoiceRef,
    handleDownloadPDF,
    handlePrint,
    handleShareOnWhatsapp,
    handleCopyInvoice,
    logoBlobUrl,
  };
};
