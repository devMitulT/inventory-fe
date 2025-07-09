// Component
import { Form, FormControl, FormLabel, FormMessage } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import CircularProgressLoader from "@/components/ui/Spinner";

// Utils
import { FormField, FormItem } from "@/contexts/FormContexts";
import { useUserChangePassword } from "./hooks/useChangePassword";
import { Eye, EyeOff } from "lucide-react";
import BreadcrumbWrapper from "@/components/ui/Breadcrumb";

const Changepassword = () => {
  const {
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
  } = useUserChangePassword();

  return (
    <div className="flex flex-col gap-4">
      <BreadcrumbWrapper routes={changePassBreadCrumb} />
      <Form {...ChangePasswordInForm}>
        <div className="flex flex-col items-center justify-center pt-4">
          <div className="flex w-[406px] flex-col gap-4 rounded-lg bg-white p-8">
            <div className="flex flex-col justify-center">
              <div>
                <Typography.Title level={4} className="pb-2">
                  Change Password
                </Typography.Title>
                <Typography.Title level={6} className="pb-3 text-sm font-normal text-[#7B7B7B]">
                  Please kindly set your new password
                </Typography.Title>
              </div>
              <form
                onSubmit={ChangePasswordInForm.handleSubmit(handleChangePassword)}
                className="flex flex-col items-center justify-center gap-4"
              >
                <FormField
                  control={ChangePasswordInForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <InputField
                            id="oldPassword"
                            type={currentPassword ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-[5px]"
                            onClick={toggleCurrentPasswordVisibility}
                          >
                            {currentPassword ? (
                              <Eye className="h-5 w-5 text-gray-700" />
                            ) : (
                              <EyeOff className="h-5 w-5 text-gray-700" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={ChangePasswordInForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <InputField
                            id="newPassword"
                            type={newPassword ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-[5px]"
                            onClick={toggleNewPasswordVisibility}
                          >
                            {newPassword ? (
                              <Eye className="h-5 w-5 text-gray-700" />
                            ) : (
                              <EyeOff className="h-5 w-5 text-gray-700" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={ChangePasswordInForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <InputField
                            id="confirmPassword"
                            type={confirmPassword ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-[5px]"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {confirmPassword ? (
                              <Eye className="h-5 w-5 text-gray-700" />
                            ) : (
                              <EyeOff className="h-5 w-5 text-gray-700" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  id="changePassword"
                  type="submit"
                  disabled={ChangePasswordPending}
                  className="w-[342px] bg-black text-white hover:bg-black hover:text-white"
                >
                  {ChangePasswordPending ? <CircularProgressLoader size={20} /> : "Change Password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Changepassword;
