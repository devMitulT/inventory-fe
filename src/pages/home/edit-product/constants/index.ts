import { z } from "zod";

export interface Product {
  _id: string;
  name: string;
  description: string;
  perUnitCost: string;
  colour: string;
  gender: string;
  size: string;
  sku: string;
  stock: string;
  thresholdStock: string;
  measurementType: string;
}

export interface EditProductProps {
  product: Product;
}
export const MEN_SIZES = ["32", "34", "36", "38", "40", "42", "44"];
export const WOMEN_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const editProductFormSchema = z
  .object({
    name: z
      .string()
      .nonempty("Product name is required.")
      .min(3, { message: "Product name must contain at least 3 characters." })
      .max(100, { message: "Product name cannot exceed 100 characters." })
      .regex(/^[\w\s\-(),.&']+$/, {
        message: "Product name contains invalid characters.",
      }),
    description: z
      .string()
      .trim()
      .nonempty("Description is required.")
      .min(10, "Description must be at least 10 characters.")
      .max(1000, "Description must be lower than 1000 characters. "),
    perUnitCost: z.union([
      z
        .string()
        .min(1, "Amount is required.")
        .max(5, "Amount must be up to 5 digits.")
        .regex(/^\d{1,5}$/, "Amount must be a number with up to 5 digits."),
      z
        .number()
        .min(0, { message: "Amount must be a positive number." })
        .refine((val) => val.toString().length <= 5, {
          message: "Amount must be up to 5 digits.",
        }),
    ]),
    colour: z.string().optional(),
    sku: z
      .string()
      .nonempty("SKU is required.")
      .trim()
      .min(3, { message: "SKU must be at least 3 characters." })
      .max(40, { message: "SKU must not exceed 40 characters." })
      .regex(/^[A-Za-z0-9]+$/, {
        message:
          "SKU must only contain letters and numbers (no special characters).",
      }),
    stock: z.union([
      z
        .string()
        .min(1, "Stock is required.")
        .max(5, "Stock must be up to 5 digits.")
        .regex(/^\d{1,5}$/, "Stock must be a number with up to 5 digits."),
      z
        .number()
        .min(0, { message: "Stock must be a positive number." })
        .refine((val) => val.toString().length <= 5, {
          message: "Stock must be up to 5 digits.",
        }),
    ]),
    thresholdStock: z.union([
      z
        .string()
        .min(1, "Threshold Stock is required.")
        .max(5, "Threshold Stock must be up to 5 digits.")
        .regex(
          /^\d{1,5}$/,
          "Threshold Stock must be a number with up to 5 digits.",
        ),
      z
        .number()
        .min(0, { message: "Threshold Stock must be a positive number." })
        .refine((val) => val.toString().length <= 5, {
          message: "Threshold Stock must be up to 5 digits.",
        }),
    ]),

    measurementType: z.string().min(1, "Measurement type is required."),
    size: z.string().optional(),
    gender: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { measurementType, colour, gender, size } = data;

    if (measurementType === "meter") {
      if (!colour || colour.length === 0) {
        ctx.addIssue({
          path: ["colour"],
          message: "Colour is required ",
          code: z.ZodIssueCode.custom,
        });
      }
      return;
    }

    if (measurementType === "piece") {
      if (!gender || !gender.trim()) {
        ctx.addIssue({
          path: ["gender"],
          message: "Gender is required",
          code: z.ZodIssueCode.custom,
        });
        return;
      }

      if (!size || !size.trim()) {
        ctx.addIssue({
          path: ["size"],
          message: "Size is required",
          code: z.ZodIssueCode.custom,
        });
        return;
      }

      const normalizedGender = gender.toLowerCase();
      const normalizedSize = size.trim().toUpperCase();

      const allowedSizes = normalizedGender === "men" ? MEN_SIZES : WOMEN_SIZES;

      if (!allowedSizes.includes(normalizedSize)) {
        ctx.addIssue({
          path: ["size"],
          message: `Invalid size for ${gender}. Allowed: ${allowedSizes.join(", ")}`,
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export const breadCrumbData = ["Products", "Edit Product"];
