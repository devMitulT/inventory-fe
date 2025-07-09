import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

// Utils
import { useSignIn } from "@/services/queries";
import { useToast } from "@/hooks/use-toast";

// Constants
import { initialSignInValues, UserSignInFormSchema } from "../constants";
import { accessToken, getAccessToken } from "@/lib/utils";
import { ROUTES } from "@/constants";

export const useUserSignIn = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isAuthorized = getAccessToken();
  const [loadingUser, setLoadingUser] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const signInForm = useForm<z.infer<typeof UserSignInFormSchema>>({
    resolver: zodResolver(UserSignInFormSchema),
    defaultValues: initialSignInValues,
  });

  const { mutateAsync: signIn, isPending: signInPending } = useSignIn();

  const handleSignIn = async (value: z.infer<typeof UserSignInFormSchema>) => {
    try {
      const data = await signIn(value);
      // set the access token in localstorage
      localStorage.setItem(accessToken, data.token);

      // store the user data in the context

      navigate(ROUTES.HOME);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message ? error.message : "An unknown error occurred.";

      toast({
        title: "Error : Sign in",
        description: errorMessage,
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    isAuthorized ? navigate(ROUTES.HOME) : setLoadingUser(false);
  }, [navigate]);

  return {
    isUserLoading: loadingUser,
    signInForm,
    handleSignIn,
    signInPending,
    showPassword,
    togglePasswordVisibility,
  };
};
