import { Form, FormControl, FormLabel, FormMessage } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import CircularProgressLoader from "@/components/ui/Spinner";
import decloneLogo from "@/assets/images/declone.png";

// Utils
import { useUserSignIn } from "./hooks/useSignIn";
import { FormField, FormItem } from "@/contexts/FormContexts";
import { Label } from "@/components/ui/Label";
import { Eye, EyeOff } from "lucide-react";

const Signin = () => {
  const {
    isUserLoading,
    signInForm,
    handleSignIn,
    signInPending,
    showPassword,
    togglePasswordVisibility,
  } = useUserSignIn();

  if (isUserLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Form {...signInForm}>
      <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
        <form
          onSubmit={signInForm.handleSubmit(handleSignIn)}
          className="grid w-[90%] grid-cols-1 rounded-md border border-gray-300 bg-white p-4 sm:w-[406px] sm:p-8"
        >
          <div className="m-auto flex w-full flex-col items-center justify-center gap-4 sm:gap-8">
            <div className="flex flex-col items-center justify-center">
              <img
                src={decloneLogo}
                height={72}
                width={72}
                alt="logo"
                className="rounded-[100px]"
              />
              <Typography.Title
                level={6}
                className="mt-[16px] pb-1 text-sm font-semibold text-black sm:pb-2"
              >
                Welcome Back!
              </Typography.Title>
              <Label className="w-full whitespace-nowrap text-center font-normal text-[#333333]">
                Please sign in to access your account.
              </Label>
            </div>
            <div className="flex w-full flex-col gap-3 sm:gap-4">
              <FormField
                control={signInForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <InputField id="email" type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <InputField
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-[6px]"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <Eye className="h-5 w-5" />
                          ) : (
                            <EyeOff className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                id="sign-in"
                type="submit"
                disabled={signInPending}
                className="mt-1 w-full bg-black text-white hover:bg-black hover:text-white sm:mt-2"
              >
                {signInPending ? <CircularProgressLoader size={20} /> : "Sign In"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default Signin;
