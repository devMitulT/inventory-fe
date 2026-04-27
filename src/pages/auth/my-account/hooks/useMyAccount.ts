import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/hooks/use-toast";
import {
  useGetMyProfile,
  useUpdateMyProfile,
} from "@/services/queries";

import {
  initialMyAccountData,
  myAccountBreadCrumb,
  myAccountFormSchema,
} from "../constants";
import { userInfo as USER_INFO_KEY } from "@/lib/utils";

export const useMyAccount = () => {
  const { toast } = useToast();

  const { data, isLoading } = useGetMyProfile();
  const { mutateAsync: updateProfile, isPending: updating } =
    useUpdateMyProfile();

  const profile = data?.data ?? null;

  const form = useForm<z.infer<typeof myAccountFormSchema>>({
    resolver: zodResolver(myAccountFormSchema),
    defaultValues: initialMyAccountData,
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name ?? "",
        mobileNumber: profile.mobileNumber ?? "",
      });
    }
  }, [profile, form]);

  const handleUpdate = async (
    values: z.infer<typeof myAccountFormSchema>,
  ) => {
    try {
      const payload: MyProfileUpdate = {
        name: values.name.trim(),
        mobileNumber: values.mobileNumber?.trim() || undefined,
      };
      const res = await updateProfile(payload);
      // refresh local cache so the navbar greeting updates
      if (res?.data) {
        const existing = localStorage.getItem(USER_INFO_KEY);
        if (existing) {
          try {
            const parsed = JSON.parse(existing);
            localStorage.setItem(
              USER_INFO_KEY,
              JSON.stringify({
                ...parsed,
                name: res.data.name,
                mobileNumber: res.data.mobileNumber,
              }),
            );
          } catch {
            /* ignore */
          }
        }
      }
      toast({
        title: "Profile updated",
        description: res?.message || "Your details have been saved.",
        duration: 2000,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Failed to update profile.";
      toast({
        title: "Error",
        description: errorMessage,
        duration: 2000,
      });
    }
  };

  return {
    form,
    profile,
    isLoading,
    handleUpdate,
    updating,
    myAccountBreadCrumb,
  };
};
