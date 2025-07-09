import React from "react";
import {
  allowOnlyNumbers,
  handleNumericChange,
  allowOnlyLetterNumber,
  handleNumberPaste,
} from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { InputField } from "@/components/ui/Input";
import { FormField, FormItem } from "@/contexts/FormContexts";

import { Textarea } from "@/components/ui/TextArea";
import CircularProgressLoader from "@/components/ui/Spinner";
import { UseFormReturn } from "react-hook-form";
import { MultiColorInput } from "../ui/MultiColorInput";

import { measurementType } from "@/pages/home/add-product/constants";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
// Define a more generic form schema type that works with both add and edit forms
export type ProductFormSchema = {
  name: string;
  description: string;
  perUnitCost: string | number;
  colour: string[];
  sku: string;
  stock: number;
  thresholdStock: number;
  measurmentType: string;
};

interface ProductFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
  handleProductCancel: () => void;
  watchDescription: number;
  isEditMode?: boolean;
  measurementTypeEnum?: [string];
}

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  onSubmit,
  isSubmitting,
  handleProductCancel,
  watchDescription,
  isEditMode,
}) => {
  const onError = (errors: any) => {
    console.log("Validation errors:", errors);
  };
  return (
    <div>
      <div className="mx-6 flex flex-col gap-4 rounded-md bg-white p-8 px-8">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="col-span-2 flex">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <InputField
                            id="productName"
                            placeholder="Product Name"
                            {...field}
                            onKeyDown={allowOnlyLetterNumber}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <InputField
                          id="sku"
                          placeholder="SKU"
                          {...field}
                          onKeyDown={allowOnlyLetterNumber}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-1 flex gap-4">
                  <FormField
                    control={form.control}
                    name="perUnitCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Per Unit Cost</FormLabel>
                        <FormControl>
                          <InputField
                            id="perUnitCost"
                            placeholder="Enter Amount"
                            type="number"
                            className="resize-none bg-white"
                            maxLength={5}
                            {...field}
                            onChange={(e) => handleNumericChange(e, field)}
                            onKeyDown={allowOnlyNumbers}
                            onPaste={handleNumberPaste}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <InputField
                          id="stock"
                          placeholder="Stock"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thresholdStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Threshold Stock</FormLabel>
                      <FormControl>
                        <InputField
                          id="thresholdStock"
                          placeholder="Threshold Stock"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-1 ">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <div className="focus-within:border-1 relative overflow-hidden rounded-lg border pb-5 focus-within:border-black focus-within:ring-0 focus-within:ring-black">
                            <Textarea
                              id="description"
                              placeholder="Description"
                              onKeyDown={allowOnlyLetterNumber}
                              maxLength={1000}
                              {...field}
                            />
                            <span className="absolute bottom-0 left-3 text-xs text-gray-500">
                              {watchDescription + 0} / 1000
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="colour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colours</FormLabel>
                      <FormControl>
                        {!isEditMode ? (
                          <MultiColorInput
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Type a color and press Enter"
                          />
                        ) : (
                          <InputField
                            id="colour"
                            placeholder="Colour"
                            {...field}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="measurementType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Measurement Type</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger
                          id="category"
                          className="h-8 w-full rounded-md border px-2  font-normal"
                        >
                          <SelectValue placeholder="Measurement Type" />
                        </SelectTrigger>

                        <SelectContent className="bg-slate-200">
                          <SelectGroup>
                            {measurementType.map(
                              (category: string, index: number) => (
                                <SelectItem
                                  key={index}
                                  value={category}
                                  className="hover:cursor-pointer"
                                >
                                  {category}
                                </SelectItem>
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bottom-10 right-10 flex justify-end gap-4 mt-5">
                <Button
                  id="cancel"
                  onClick={handleProductCancel}
                  variant="outline"
                  type="button"
                  className="w-[150px] rounded-lg text-black"
                >
                  Cancel
                </Button>
                <Button
                  id="saveEditProduct"
                  disabled={Boolean(isSubmitting)}
                  type="submit"
                  className="w-[150px] rounded-lg bg-black text-white hover:bg-black hover:text-white"
                >
                  {isSubmitting ? (
                    <CircularProgressLoader size={20} />
                  ) : isEditMode ? (
                    "Save"
                  ) : (
                    "+ Add Product"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
