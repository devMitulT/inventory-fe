import { billColumns, billProductColumns } from "../constants";
import { useGetBookingById } from "@/services/queries";
import { useReactToPrint } from "react-to-print";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

//@ts-ignore
import html2pdf from "html2pdf.js";
import "jspdf-autotable";
import { generatePDF } from "@/lib/pdfUtils";

export const useViewOrder = () => {
  const invoiceRef = useRef(null);
  const location = useLocation();
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

  const handleShareOnWhatsapp = () => {
    const whatsappData = bookingData?.data;

    const invoiceDetails = {
      amount: whatsappData?.amount || 0,
      deposit: whatsappData?.depositeAmount || 0,
      invoiceNumber: whatsappData?.invoiceNumber || "N/A",
    };

    const orgName =
      whatsappData?.organizationId?.organizationName || "Your Organization";
    const orderId = whatsappData?._id;
    const currentDomain = window.location.origin;
    const receiptUrl = `${currentDomain}/e-receipt/${orderId}`;

    const message =
      `*Invoice Details:*\n` +
      `Bill From: *${orgName}*\n` +
      `Invoice Number: *${invoiceDetails.invoiceNumber}*\n\n` +
      `*Please find the invoice attached:*\n${receiptUrl}`;

    const rawPhone = whatsappData?.customer?.phoneNumberPrimary;

    if (rawPhone) {
      const whatsappUrl = `https://wa.me/+91${rawPhone}?text=${encodeURIComponent(message)}`;
      console.log("WhatsApp URL:", whatsappUrl);
      window.open(whatsappUrl, "_blank");
    } else {
      alert("Customer phone number is not available.");
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
    logoBlobUrl,
  };
};
