import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { InputField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import CircularProgressLoader from "@/components/ui/Spinner";

interface VerifyPasswordModalProps {
  open: boolean;
  email: string;
  onCancel: () => void;
  onVerify: (password: string) => Promise<void> | void;
  isVerifying: boolean;
  errorMessage?: string;
}

const VerifyPasswordModal = ({
  open,
  email,
  onCancel,
  onVerify,
  isVerifying,
  errorMessage,
}: VerifyPasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isVerifying) return;
    await onVerify(password);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-black">
            Verification
          </DialogTitle>
          <p className="text-xs font-normal text-[#7B7B7B]">
            Enter your password to continue
            <br />
            {email}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <InputField
              id="verifyPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              maxLength={32}
            />
            <button
              type="button"
              className="absolute right-3 top-[5px]"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="h-5 w-5 text-gray-700" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>

          {errorMessage && (
            <span className="text-xs text-red-500">{errorMessage}</span>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              id="cancelVerify"
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-[120px] rounded-lg text-black"
            >
              Cancel
            </Button>
            <Button
              id="submitVerify"
              type="submit"
              disabled={isVerifying || !password.trim()}
              className="w-[120px] rounded-lg bg-black text-white hover:bg-black hover:text-white"
            >
              {isVerifying ? (
                <CircularProgressLoader size={20} />
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyPasswordModal;
