import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

// Utils
import { useSignIn } from "@/services/queries";
import { useToast } from "@/hooks/use-toast";

// Constants
import { initialSignInValues, UserSignInFormSchema } from "../constants";
import { accessToken, getAccessToken, userInfo } from "@/lib/utils";
import { ROUTES } from "@/constants";

export const useUserSignIn = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
      // wipe any cached data from a previous session before storing the new token
      queryClient.clear();
      // set the access token + user in localstorage
      localStorage.setItem(accessToken, data.token);
      localStorage.setItem(userInfo, JSON.stringify(data.user));

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
