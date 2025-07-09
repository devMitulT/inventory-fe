// lib/pdfUtils.ts
//@ts-ignore
import html2pdf from "html2pdf.js";

export const generatePDF = async (
  element: HTMLElement,
  filename = "Invoice.pdf"
): Promise<void> => {
  const options = {
    margin: [0.5, 0, 0, 0], // mm
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    autoPaging: "text" as const,
  };

  const clonedElement = element.cloneNode(true) as HTMLElement;

  await html2pdf().from(clonedElement).set(options).save();
};
