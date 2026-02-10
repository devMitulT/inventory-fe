import { z } from "zod";
export const MEN_SIZES = ["32", "34", "36", "38", "40", "42", "44"];
export const WOMEN_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const createProductFormSchema = z
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

    measurementType: z
      .string()
      .min(1, "Measurement type is required")
      .refine((v) => ["meter", "piece"].includes(v), {
        message: "Measurement type must be meter or piece",
      }),
    gender: z.string().optional(),
    colour: z.array(z.string()).optional(),
    size: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    const { measurementType, colour, gender, size } = data;

    /* meter → colour required */
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

    /* piece → gender + size required */
    if (measurementType === "piece") {
      if (!gender || !gender.trim()) {
        ctx.addIssue({
          path: ["gender"],
          message: "Gender is required",
          code: z.ZodIssueCode.custom,
        });
        return;
      }

      if (!size || size.length === 0) {
        ctx.addIssue({
          path: ["size"],
          message: "At least one size is required",
          code: z.ZodIssueCode.custom,
        });
        return;
      }

      const normalizedGender = gender.toLowerCase();
      const sizeList = size.map((s) => s.trim().toUpperCase()).filter(Boolean);

      if (sizeList.length === 0) {
        ctx.addIssue({
          path: ["size"],
          message: "Invalid size format",
          code: z.ZodIssueCode.custom,
        });
        return;
      }

      const allowedSizes = normalizedGender === "men" ? MEN_SIZES : WOMEN_SIZES;

      const invalidSizes = sizeList.filter((s) => !allowedSizes.includes(s));

      if (invalidSizes.length > 0) {
        ctx.addIssue({
          path: ["size"],
          message: `Invalid sizes for ${gender}: ${invalidSizes.join(
            ", ",
          )}. Allowed: ${allowedSizes.join(", ")}`,
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export const measurementType = [
  { value: "meter", label: "Meter" },
  { value: "piece", label: "Piece" },
];
export const gender = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
];
export const initialProductData = {
  name: "",
  description: "",
  perUnitCost: "",
  colour: [],
  sku: "",
  stock: "",
  thresholdStock: "",
  measurmentType: "",
};

export const breadCrumbData = ["Products", "Add Product"];
