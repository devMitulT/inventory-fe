import { z } from "zod";

export interface CreateAndEditEventFormProps {
  initialData?: CalendarDataType;
  products: Products[];
  formType: string | undefined;
}

export interface CalendarDataType {
  start: string;
  end: string;
  id: string;
  text: string;
  productId: string[];
}

export interface Products {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  sku: string;
}
const calculateTotalAmount = (products: any[]) =>
  products.reduce(
    (acc, item) => acc + Number(item.perUnitCost) * Number(item.unit),
    0,
  );

export const productBookingSchema = z
  .object({
    products: z
      .array(
        z.object({
          productName: z.string().nonempty("Product Name is required."),
          productId: z.string().nonempty("Product ID is required."),
          perUnitCost: z.union([z.number(), z.string().min(1, "")]),
          unit: z.union([
            z.number().min(1, "Atleast one unit is required"),
            z.string().min(1, "Product Unit is required"),
          ]),
          stock: z.union([z.number(), z.string()]),
        }),
      )
      .min(1, "At least one product is required."),
    customerName: z
      .string()
      .min(1, "Customer Name is required.")
      .regex(/^[A-Za-z\s]+$/, {
        message: "Name must contain only letters and spaces.",
      }),
    notes: z.string().trim(),
    phoneNumberPrimary: z
      .string()
      .nonempty("Mobile No. is required.")
      .length(10, "Phone number must be exactly 10 digits."),
    phoneNumberSecondary: z.string().optional(),
    amount: z.string().nonempty("Amount is required."),
    gstNumber: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) =>
          !val ||
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val),
        {
          message: "Invalid GST number",
        },
      ),
    discountAmount: z.union([z.string(), z.number()]),
    discountType: z
      .string({
        required_error: "Discount Type is required.",
      })

      .refine((val) => ["percentage", "flat"].includes(val), {
        message: "Discount Type is required.",
      }),
    gstRate: z.coerce
      .number({
        required_error: "GST Rate is required",
        invalid_type_error: "GST Rate must be a number",
      })
      .min(0, "GST Rate must be at least 0")
      .max(100, "GST Rate must be at most 100"),
  })
  .refine(
    (data) => {
      if (!data.phoneNumberPrimary) return true;
      return data.phoneNumberPrimary !== data.phoneNumberSecondary;
    },
    {
      message: "Alternate number must be different.",
      path: ["phoneNumberSecondary"],
    },
  )
  .refine(
    (data) => {
      if (
        data.discountType === "flat" &&
        Number(data?.products[0]?.unit) > 0 &&
        Number(data.discountAmount) < 0
      ) {
        const discount = Number(data.discountAmount);
        const amount = calculateTotalAmount(data.products);

        return discount < amount;
      }
      return true;
    },
    {
      message: "Discount ₹ must be less than total amount.",
      path: ["discountAmount"],
    },
  )
  .refine(
    (data) => {
      if (data.discountType === "percentage") {
        const discount = Number(data.discountAmount);
        return discount >= 0 && discount <= 100;
      }
      return true;
    },
    {
      message: "Discount % must be between 0 and 100.",
      path: ["discountAmount"],
    },
  )
  .refine(
    (data) => {
      if (!data.amount) return true;
      return Number(data.amount) >= Number(data.discountAmount);
    },
    {
      message: "Discount must be less than total amount.",
      path: ["discountAmount"],
    },
  )
  .refine(
    (data) => {
      if (data.gstNumber) {
        return data?.gstRate;
      }
      return true;
    },
    {
      message: "Please provide the GST rate when a GSTIN is added",
      path: ["gstRate"],
    },
  );
export const createBookingBreadScrum = ["Home", "Create Booking"];

export const editBookingBreadScrum = ["Orders", "Edit Booking"];
