import * as React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../Command/command";

import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { Button } from "../Button";
import { FormControl } from "../Form";

type SelectOptions = {
  label: string;
  value: string;
  [key: string]: any;
};

type ComboBoxProps = {
  label: string;
  value?: string;
  className?: string;
  setValue: (arg: SelectOptions) => void;
  options: SelectOptions[] | any;
  isOptionLoading: boolean;
  search?: string;
  setSearch: (arg: any) => void;
  id?: string;
};

export function Combobox({
  label,
  value,
  setValue,
  options = [],
  className,
  search,
  setSearch,
  isOptionLoading = false,
  id,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  const filteredOptions = options.filter((option: any) =>
    option.label.toLowerCase().includes(search?.toLowerCase() || "")
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            onMouseDown={(e) => e.preventDefault()}
            className={cn("h-8 justify-between overflow-hidden", className)}
          >
            <span className="max-w-full overflow-hidden truncate"> {value ? value : label}</span>
            {open ? (
              <ChevronUp className="mt-0 h-6 w-6 text-gray-700" />
            ) : (
              <ChevronDown className="mt-0 h-6 w-6 text-gray-700" />
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto min-w-[var(--radix-popover-trigger-width)] p-0", className)}
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={(e) => setSearch(e)}
            placeholder="Search..."
          />
          <CommandList>
            {isOptionLoading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : filteredOptions.length === 0 ? (
              <CommandEmpty>No product found</CommandEmpty>
            ) : null}
            <CommandGroup>
              {filteredOptions.map((item: any, index: any) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  className="cursor-pointer"
                  data-testid={`product_item_${index + 1}`}
                  onSelect={() => {
                    setValue(item);
                    setTimeout(() => {
                      setOpen(false);
                    }, 0);
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                >
                  <span className="block w-auto max-w-[calc(var(--radix-popover-trigger-width)-60px)] overflow-hidden truncate">
                    {item.label}
                  </span>

                  <Check
                    className={cn("ml-auto", value === item.value ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
