// components/ConfirmModal.tsx
import React from "react";
import { Button } from "@/components/ui/Button";
import CircularProgressLoader from "@/components/ui/Spinner";

interface ConfirmModalProps {
  title: string;
  message: string;
  subMessage?: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  subMessage,
  isOpen,
  onCancel,
  onConfirm,
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400 bg-opacity-50">
      <div className="w-[512px] rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-[24px] font-semibold text-[#000000]">{title}</h2>
        <span className="mt-2 font-medium text-[#4D4D4D]">{message}</span>
        {subMessage && <span className="mt-2 block font-medium text-[#4D4D4D]">{subMessage}</span>}
        <div className="mt-4 flex justify-end space-x-4">
          <Button
            type="button"
            className="h-8 w-32 border border-black bg-white text-black"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            className="h-8 w-32 border border-black bg-black text-white"
            onClick={onConfirm}
          >
            {isLoading ? <CircularProgressLoader size={20} /> : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
