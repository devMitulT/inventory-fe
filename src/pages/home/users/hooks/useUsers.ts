import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/hooks/use-toast";
import {
  useGetOrgUsers,
  useCreateOrgUser,
  useToggleOrgUserActive,
} from "@/services/queries";

import {
  addUserFormSchema,
  initialAddUserData,
  usersBreadCrumb,
} from "../constants";

export const useUsers = () => {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data, isLoading, refetch } = useGetOrgUsers();
  const { mutateAsync: createOrgUser, isPending: creating } =
    useCreateOrgUser();
  const { mutateAsync: toggleActive, isPending: toggling } =
    useToggleOrgUserActive();

  const users: OrgUser[] = data?.data ?? [];

  const form = useForm<z.infer<typeof addUserFormSchema>>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: initialAddUserData,
  });

  const handleOpenAdd = () => {
    form.reset(initialAddUserData);
    setShowPassword(false);
    setIsAddOpen(true);
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
    form.reset(initialAddUserData);
  };

  const handleCreateUser = async (
    values: z.infer<typeof addUserFormSchema>,
  ) => {
    try {
      const payload: NewUserPayload = {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        mobileNumber: values.mobileNumber?.trim() || undefined,
      };
      const res = await createOrgUser(payload);
      toast({
        title: "Employee Created",
        description: res?.message || "Employee created successfully.",
        duration: 2000,
      });
      handleCloseAdd();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Failed to create employee.";
      toast({
        title: "Error Creating Employee",
        description: errorMessage,
        duration: 2000,
      });
    }
  };

  const handleToggleActive = async (user: OrgUser) => {
    try {
      const res = await toggleActive(user._id);
      toast({
        title: "Status Updated",
        description: res?.message || "Employee status updated.",
        duration: 2000,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Failed to update employee status.";
      toast({
        title: "Error",
        description: errorMessage,
        duration: 2000,
      });
    }
  };

  return {
    users,
    isLoading,
    isAddOpen,
    handleOpenAdd,
    handleCloseAdd,
    form,
    handleCreateUser,
    creating,
    handleToggleActive,
    toggling,
    showPassword,
    togglePasswordVisibility: () => setShowPassword((p) => !p),
    refetch,
    usersBreadCrumb,
  };
};
