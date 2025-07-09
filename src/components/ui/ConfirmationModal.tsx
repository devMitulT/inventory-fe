import React from "react";
import { Button } from "@/components/ui/Button";

import CircularProgressLoader from "./Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/Command/dialog";
import { DialogFooter, DialogHeader } from "./Dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  subMessage?: string;
  confirmButtonText: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  subMessage,
  confirmButtonText,
  cancelButtonText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[512px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
          {subMessage && <DialogDescription>{subMessage}</DialogDescription>}
        </DialogHeader>

        <DialogFooter className="flex justify-end space-x-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="h-8 w-32 rounded-lg border border-black text-black"
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={onConfirm}
            className="h-8 w-32 rounded-lg border border-black bg-black text-white hover:bg-black hover:text-white"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgressLoader size={20} /> : confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
