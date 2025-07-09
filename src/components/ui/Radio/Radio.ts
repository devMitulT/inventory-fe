import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

export interface RadioProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string;
  labelClassName?: string;
}
