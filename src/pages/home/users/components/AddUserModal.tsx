import { Eye, EyeOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { FormField, FormItem } from "@/contexts/FormContexts";
import { InputField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import CircularProgressLoader from "@/components/ui/Spinner";
import {
  allowOnlyLetters,
  allowOnlyNumbers,
  handleNumberPaste,
} from "@/lib/utils";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

const AddUserModal = ({
  open,
  onClose,
  form,
  onSubmit,
  isSubmitting,
  showPassword,
  togglePasswordVisibility,
}: AddUserModalProps) => {
  const onError = (errors: any) => console.log("Validation errors:", errors);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-black">
            Add Employee
          </DialogTitle>
          <p className="text-xs font-normal text-[#7B7B7B]">
            Create a new employee for your organization. Share these credentials
            with them so they can log in.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <InputField
                      id="userName"
                      placeholder="Full name"
                      maxLength={50}
                      onKeyDown={allowOnlyLetters}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <InputField
                      id="userEmail"
                      type="email"
                      placeholder="user@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number (optional)</FormLabel>
                  <FormControl>
                    <InputField
                      id="userMobile"
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit mobile"
                      onKeyDown={allowOnlyNumbers}
                      onPaste={handleNumberPaste}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <InputField
                        id="userPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="6-16 characters"
                        maxLength={16}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-[5px]"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
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

            <div className="flex justify-end gap-3 pt-2">
              <Button
                id="cancelAddUser"
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-[120px] rounded-lg text-black"
              >
                Cancel
              </Button>
              <Button
                id="submitAddUser"
                type="submit"
                disabled={isSubmitting}
                className="w-[120px] rounded-lg bg-black text-white hover:bg-black hover:text-white"
              >
                {isSubmitting ? (
                  <CircularProgressLoader size={20} />
                ) : (
                  "Add Employee"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
