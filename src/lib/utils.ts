import { clsx, type ClassValue } from "clsx";
import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

export const accessToken: string = "accessToken";
export const userInfo: string = "userInfo";
export const userprofileInfo: string = "userprofileInfo";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAccessToken = () => {
  return localStorage.getItem(accessToken);
};

export const getUserInfo = () => {
  return localStorage.getItem(userInfo);
};

export const getUserProfileInfo = () => {
  return localStorage.getItem(userprofileInfo);
};

export function getTodayDate() {
  const today = new Date(); // Get current local date
  today.setHours(0, 0, 0, 0); // Reset time to midnight

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

export function getTomorrowDate() {
  const tomorrow = new Date(); // Get current local date
  tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day
  tomorrow.setHours(0, 0, 0, 0); // Reset time to midnight

  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const dd = String(tomorrow.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

export const formatDate = (date: Date) => {
  if (date === undefined) {
    return "";
  }
  const year = date?.getFullYear();
  const month = String(date?.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are 0-based
  const day = String(date?.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function normalizeText(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
    .replace(/^./, (match) => match.toUpperCase()); // Capitalize first letter
}

export const allowOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];
  const isControlCombo =
    (e.ctrlKey || e.metaKey) && ["v", "c", "x", "a"].includes(e.key.toLowerCase());

  if (allowedKeys.includes(e.key) || /^\d$/.test(e.key) || isControlCombo) {
    return;
  }
  e.preventDefault();
};

export const handleNumberPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  const pastedText = e.clipboardData.getData("Text");

  if (!/^\d+$/.test(pastedText)) {
    e.preventDefault();
  }
};

export const allowOnlyLetters = (
  e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];
  const input = e.currentTarget;
  const value = input.value;
  const selectionStart = input.selectionStart ?? 0;

  const isControlCombo = (e.ctrlKey || e.metaKey) && ["v", "c", "x"].includes(e.key.toLowerCase());

  if (allowedKeys.includes(e.key) || isControlCombo) {
    return;
  }

  if (!/^[A-Za-z ]$/.test(e.key)) {
    e.preventDefault();
    return;
  }

  if (e.key === " " && selectionStart === 0) {
    e.preventDefault();
    return;
  }

  if (e.key === " " && value[selectionStart - 1] === " ") {
    e.preventDefault();
    return;
  }
};

export const allowOnlyLetterNumber = (
  e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];

  const specialCharRegex = /[\x20-\x7E\u00A0-\uD7FF\uF900-\uFFFF]/;

  const input = e.currentTarget;

  if (!specialCharRegex.test(e.key) && !allowedKeys.includes(e.key)) {
    e.preventDefault();
    return;
  }

  const selectionStart = input.selectionStart ?? 0;
  const value = input.value;

  if (e.key === " " && selectionStart === 0) {
    e.preventDefault();
    return;
  }
  if (e.key === " " && selectionStart === value.length && value.endsWith(" ")) {
    e.preventDefault();
    return;
  }
  if (e.key === " " && selectionStart > 0 && value[selectionStart - 1] === " ") {
    e.preventDefault();
  }
};

export const handleNumericChange = (e: ChangeEvent<HTMLInputElement>, field: any) => {
  const value = e.target.value;
  if (/^\d{0,5}$/.test(value)) {
    field.onChange(e);
  }
};

export function formatStringDate(dateString: string) {
  const date = new Date(dateString);

  if (isNaN(date?.getTime())) {
    throw new Error("Invalid date string");
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const formattedDate = date.toLocaleDateString("en-GB", options);

  const parts = formattedDate.split(" ");
  if (parts.length === 3) {
    return `${parts[0]} ${parts[1]}, ${parts[2]}`;
  }

  return formattedDate;
}
export const formatINR = (value: number) => {
  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 3,
  })}`;
};

export const formatAddress = (address: string): string[] => {
  if (!address) return ["No Address Found"];

  const parts = address.split(",");

  if (parts.length > 1) {
    const firstLine = parts.slice(0, -3).join(",").trim();
    const secondLine = parts.slice(-3).join(",").trim();

    return [firstLine, secondLine];
  }

  return [address];
};

export const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};
