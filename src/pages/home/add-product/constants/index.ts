import { z } from "zod";

export const createProductFormSchema = z.object({
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
  colour: z
    .array(z.string().min(0, "Colour  is required."))
    .min(1, { message: "Colour is required." }),

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
        "Threshold Stock must be a number with up to 5 digits."
      ),
    z
      .number()
      .min(0, { message: "Threshold Stock must be a positive number." })
      .refine((val) => val.toString().length <= 5, {
        message: "Threshold Stock must be up to 5 digits.",
      }),
  ]),

  measurementType: z.string().min(1, "Measurement type is required."),
});

export const measurementType = ["meter", "piece"];

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
