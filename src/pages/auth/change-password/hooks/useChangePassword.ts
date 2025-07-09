import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Utils
import { useChangePassword } from "@/services/queries";
import { useToast } from "@/hooks/use-toast";

// Constants
import {
  changePassBreadCrumb,
  initialChangePasswordValues,
  UserChangePasswordFormSchema,
} from "../constants";
import { useState } from "react";

export const useUserChangePassword = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  const toggleCurrentPasswordVisibility = () => setCurrentPassword((prev) => !prev);
  const toggleNewPasswordVisibility = () => setNewPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setConfirmPassword((prev) => !prev);

  const ChangePasswordInForm = useForm<z.infer<typeof UserChangePasswordFormSchema>>({
    resolver: zodResolver(UserChangePasswordFormSchema),
    defaultValues: initialChangePasswordValues,
  });

  const { mutateAsync: changePassword, isPending: ChangePasswordPending } = useChangePassword();

  const handleChangePassword = async (value: z.infer<typeof UserChangePasswordFormSchema>) => {
    try {
      const { confirmPassword, ...remainValues } = value;
      const data = await changePassword(remainValues);

      toast({
        title: "Change Password",
        description: data.message || "Password changed successfully",
        duration: 2000,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        (error instanceof Error && error.message) ||
        "An unknown error occurred.";
      if (errorMessage.toLowerCase().includes("incorrect")) {
        ChangePasswordInForm.setError("oldPassword", {
          type: "manual",
          message: "Current password is incorrect.",
        });
      }

      toast({
        title: "Error: Current password is incorrect",
        duration: 2000,
      });
    }
  };

  return {
    ChangePasswordInForm,
    handleChangePassword,
    ChangePasswordPending,
    currentPassword,
    newPassword,
    confirmPassword,
    toggleCurrentPasswordVisibility,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    changePassBreadCrumb,
  };
};
