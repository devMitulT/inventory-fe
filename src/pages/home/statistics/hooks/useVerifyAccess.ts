import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSignIn } from "@/services/queries";
import { getCurrentUser } from "@/lib/utils";
import { ROUTES } from "@/constants";

export const useVerifyAccess = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const email = currentUser?.email ?? "";

  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { mutateAsync: signIn, isPending: isVerifying } = useSignIn();

  const handleVerify = async (password: string) => {
    if (!email) {
      setErrorMessage("Unable to determine current user.");
      return;
    }
    setErrorMessage("");
    try {
      await signIn({ email, password });
      setIsVerified(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Incorrect password.";
      setErrorMessage(message);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.HOME);
  };

  return {
    email,
    isVerified,
    isVerifying,
    errorMessage,
    handleVerify,
    handleCancel,
  };
};
