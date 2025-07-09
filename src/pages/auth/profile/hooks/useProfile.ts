import React, { useState, useEffect } from "react";
import {
  useGetOrgnaztionInfo,
  useUpdateOrganization,
} from "@/services/queries";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema } from "../constants";

type DeleteType = "existingNotes" | "newNotes" | null;

export const useProfile = () => {
  const { data: userData, isLoading: orgLoading } = useGetOrgnaztionInfo();
  const { mutate: updateOrganization, isPending: updatingProfile } =
    useUpdateOrganization();

  const [userName, setUserName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [gstIN, setGstIN] = useState("");
  const [rules, setRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState("");
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [addError, setAddError] = useState("");
  const makedisable = rules.map((el) => el.length === 0).includes(true);
  const disableUpdate =
    rules.some((rule) => rule.trim() === "") ||
    (isAddingRule && newRule.trim() === "");
  const [profileImageError, setProfileImageError] = useState(false);

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<DeleteType>(null);

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ownerName: "",
      organizationName: "",
      description: "",
      address: "",
      gstNumber: "",
    },
    mode: "all",
  });

  useEffect(() => {
    if (userData?.data) {
      const orgLogo = userData?.data?.logo;

      setOrganizationName(userData?.data?.organizationName || "");
      setUserName(userData?.data?.ownerName || "");
      setRules(userData?.data?.billingRules || []);
      setDescription(userData?.data?.description || "");
      setAddress(userData?.data?.address || "");
      setGstIN(userData?.data?.gstNumber);
      if (typeof orgLogo === "string") {
        setImagePreview(orgLogo);
        setLogo(null);
      } else {
        setImagePreview(null);
      }
      form.reset({
        organizationName: userData?.data?.organizationName || "",
        ownerName: userData?.data?.ownerName || "",
        description: userData?.data?.description || "",
        address: userData?.data?.address || "",
        gstNumber: userData?.data?.gstNumber || "",
      });
    }
  }, [userData, form]);

  //existing notes
  const requestRuleDelete = (index: number) => {
    setDeleteIndex(index);
    setIsConfirmOpen("existingNotes");
  };

  const confirmRuleDelete = () => {
    if (isConfirmOpen === "existingNotes" && deleteIndex !== null) {
      handleRemoveRule(deleteIndex);
      setDeleteIndex(null);
    } else if (isConfirmOpen === "newNotes") {
      setNewRule("");
      setIsAddingRule(false);
    }
    setIsConfirmOpen(null);
  };

  const cancelRuleDelete = () => {
    setDeleteIndex(null);
    setIsConfirmOpen(null);
  };

  //new notes
  const requestNewRuleDelete = () => {
    setIsConfirmOpen("newNotes");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      setProfileImageError(true);
      setLogo(null);
      return;
    }
    setLogo(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setProfileImageError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveRule = (index: number) => {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === "INPUT") {
      (document.activeElement as HTMLElement)?.blur();
    }
    setRules((prevRules) => prevRules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, value: string) => {
    const updatedRules = [...rules];
    updatedRules[index] = value;
    setRules(updatedRules);
  };

  const handleClearRule = (index: number) => {
    const updatedRules = [...rules];
    updatedRules[index] = "";
    setRules(updatedRules);
  };

  const bottomRef = React.useRef<HTMLDivElement | null>(null);
  const handleAddRule = () => {
    if (rules.length >= 10) {
      setAddError("maximum 10 note is allow.");
      return;
    }
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    setAddError("");
    if (isAddingRule) {
      if (newRule.trim()) {
        setRules((prevRules) => [...prevRules, newRule.trim()]);
        setNewRule("");
        setIsAddingRule(false);
      } else {
        toast({
          title: "Error",
          description: "Please enter a valid note.",
          duration: 2000,
        });
      }
    } else {
      setIsAddingRule(true);
    }
  };
  const handleUpdate = form.handleSubmit((formData) => {
    if (profileImageError) {
      toast({
        title: "Invalid Profile Image",
        description: "Please upload a valid image file ( jpg, png, jpeg ).",
        duration: 2000,
      });
      return;
    }
    const orgInfo = userData?.data;
    if (!orgInfo) return;
    const hasErrors =
      form.formState.errors.organizationName ||
      form.formState.errors.ownerName ||
      form.formState.errors.description ||
      form.formState.errors.address;

    if (hasErrors) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        duration: 2000,
      });
      return;
    }

    const updatedData = {
      organizationName: formData.organizationName,
      ownerName: formData.ownerName,
      description: formData.description,
      email: orgInfo.email,
      contactNumber: orgInfo.contactNumber,
      billingRules: rules.filter((el) => el.length !== 0),
      logo: logo || null,
      address: formData.address,
      id: orgInfo._id,
      gstNumber: formData.gstNumber,
    };

    updateOrganization(updatedData, {
      onSuccess: () => {
        toast({
          title: "Profile Updated Successfully",
          description: "Your profile has been updated successfully.",
          duration: 2000,
        });
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          "An error occurred while updating the profile.";
        toast({
          title: "Error Updating Profile",
          description: errorMessage,
          duration: 2000,
        });
      },
    });
    setIsAddingRule(false);
  });

  const isLoading = orgLoading;

  return {
    form,
    isLoading,
    userName,
    setUserName,
    organizationName,
    setOrganizationName,
    description,
    setDescription,
    address,
    setAddress,
    rules,
    gstIN,
    setRules,
    newRule,
    setNewRule,
    isAddingRule,
    logo,
    imagePreview,
    handleImageChange,
    handleRemoveRule,
    handleRuleChange,
    handleClearRule,
    handleAddRule,
    handleUpdate,
    setIsAddingRule,
    makedisable,
    disableUpdate,
    addError,
    updatingProfile,
    profileImageError,
    setProfileImageError,
    isConfirmOpen,
    requestRuleDelete,
    confirmRuleDelete,
    cancelRuleDelete,
    requestNewRuleDelete,
  };
};
