import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

export interface CheckboxFieldProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  labelClassName?: string;
}
