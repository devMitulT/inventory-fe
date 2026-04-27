import { z } from "zod";

export const usersBreadCrumb = ["Users"];

export const addUserFormSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required.")
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),
  email: z
    .string()
    .nonempty("Email is required.")
    .email("Invalid email format."),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(6, { message: "Password must be at least 6 characters." })
    .max(16, { message: "Password cannot exceed 16 characters." }),
  mobileNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "Mobile number must be exactly 10 digits.",
    }),
});

export const initialAddUserData = {
  name: "",
  email: "",
  password: "",
  mobileNumber: "",
};
