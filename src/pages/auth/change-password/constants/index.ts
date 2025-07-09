import { z } from "zod";

export const initialChangePasswordValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const UserChangePasswordFormSchema = z
  .object({
    oldPassword: z
      .string()
      .nonempty("Current Password is required.")
      .min(6, { message: "Password must be at least 6 characters." })
      .max(20, { message: "Password must be at most 20 characters." }),
    newPassword: z
      .string()
      .nonempty("New password is required")
      .min(6, { message: "Password must be at least 6 characters." })
      .max(20, { message: "Password must be at most 20 characters." }),
    confirmPassword: z
      .string()
      .nonempty("Confirm Password is required.")
      .min(6, "Confirm password must be at least 6 characters."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password are not same.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Current password and New password cannot be same.",
    path: ["newPassword"],
  });

export const changePassBreadCrumb = ["Home", "Change Password"];
