import { z } from "zod";

export const myAccountBreadCrumb = ["My Account"];

export const myAccountFormSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required.")
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),
  mobileNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "Mobile number must be exactly 10 digits.",
    }),
});

export const initialMyAccountData = {
  name: "",
  mobileNumber: "",
};
