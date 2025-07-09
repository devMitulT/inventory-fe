import { z } from "zod";

export const initialSignInValues = {
  email: "",
  password: "",
};

export const UserSignInFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(1, { message: "Password is required!" })
    .min(6, { message: "Password must be at least 6 characters!" })
    .max(20, { message: "Password can be at most 20 characters!" }),
});
