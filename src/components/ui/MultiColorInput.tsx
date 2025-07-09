import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { InputField } from "./Input";

interface MultiColorInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiColorInput({
  value,
  onChange,
  placeholder,
  className,
}: MultiColorInputProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", "Tab"].includes(e.key) && input.trim() !== "") {
      e.preventDefault();
      const newValue = input.trim();
      if (!value.includes(newValue)) {
        onChange([...value, newValue]);
      }
      setInput("");
    }
  };

  const removeColor = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border border-input rounded-md px-3 py-2",
        className
      )}
    >
      {value.map((tag, index) => (
        <div
          key={index}
          className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-md"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => removeColor(index)}
            className="ml-1 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <InputField
        className="flex-1 border-none focus-visible:ring-0 p-0 m-0 shadow-none"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
