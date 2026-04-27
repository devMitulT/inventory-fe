import BreadcrumbWrapper from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { FormField, FormItem } from "@/contexts/FormContexts";
import { InputField } from "@/components/ui/Input";
import CircularProgressLoader from "@/components/ui/Spinner";
import {
  allowOnlyLetters,
  allowOnlyNumbers,
  handleNumberPaste,
} from "@/lib/utils";
import { useMyAccount } from "./hooks/useMyAccount";

const MyAccount = () => {
  const { form, profile, isLoading, handleUpdate, updating, myAccountBreadCrumb } =
    useMyAccount();

  if (isLoading) {
    return (
      <div className="mt-72 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center p-2">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-gray-500"></div>
        </div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)}>
          <div className="flex items-center justify-between">
            <BreadcrumbWrapper routes={myAccountBreadCrumb} />
            <Button
              id="saveMyAccount"
              type="submit"
              disabled={updating}
              className="mx-6 h-8 w-[128px] rounded-lg bg-black py-2 text-sm font-medium text-white hover:bg-black hover:text-white"
            >
              {updating ? <CircularProgressLoader size={20} /> : "Save"}
            </Button>
          </div>

          <div className="mx-6 mb-6 flex flex-col gap-4 rounded-md border bg-white p-6">
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#4D4D4D]">
                      Name
                    </FormLabel>
                    <FormControl>
                      <InputField
                        id="myAccountName"
                        placeholder="Your name"
                        maxLength={50}
                        onKeyDown={allowOnlyLetters}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-sm font-medium text-[#4D4D4D]">
                  Email
                </FormLabel>
                <FormControl>
                  <InputField
                    id="myAccountEmail"
                    value={profile?.email ?? ""}
                    disabled
                    readOnly
                  />
                </FormControl>
              </FormItem>

              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#4D4D4D]">
                      Mobile Number (optional)
                    </FormLabel>
                    <FormControl>
                      <InputField
                        id="myAccountMobile"
                        type="tel"
                        placeholder="10-digit mobile"
                        maxLength={10}
                        onKeyDown={allowOnlyNumbers}
                        onPaste={handleNumberPaste}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-sm font-medium text-[#4D4D4D]">
                  Role
                </FormLabel>
                <FormControl>
                  <InputField
                    id="myAccountRole"
                    value={
                      profile?.role === "superAdmin" ? "Super Admin" : "User"
                    }
                    disabled
                    readOnly
                  />
                </FormControl>
              </FormItem>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MyAccount;
