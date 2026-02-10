import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";

import { FormField, FormItem } from "@/contexts/FormContexts";
import { Button } from "@/components/ui/Button";
import {
  allowOnlyLetterNumber,
  allowOnlyLetters,
  allowOnlyNumbers,
  handleNumberPaste,
} from "@/lib/utils";

import { InputField } from "@/components/ui/Input";
import CircularProgressLoader from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/TextArea";
import { useCreatProductBooking } from "./hooks/useCreatProductBooking";
import BreadcrumbWrapper from "@/components/ui/Breadcrumb";
import { Combobox } from "@/components/ui/Combobox";
import { Plus } from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const CreateBookingPage = () => {
  const {
    formType,
    form,
    onSubmit,
    handleIncreamentProduct,
    isPending,
    handleSelectProduct,
    watchNotes,
    createBookingBreadScrum,
    productsFields,
    watchProduct,
    handleCancelBooking,
    searchProduct,
    setSearchProduct,
    allProductLoading,
    allProducts,
    location,
    bottomRef,
    editBookingBreadScrum,
    addError,
    conflicts,
    handleDeleteProduct,
    deleteIndex,
    showModal,
    confirmDelete,
    cancelDelete,
  } = useCreatProductBooking();
  return (
    <div className="pb-12">
      <BreadcrumbWrapper
        routes={
          location?.state?.formType === "edit"
            ? editBookingBreadScrum
            : createBookingBreadScrum
        }
      />

      <div className="flex flex-col gap-4 px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4">
            <div className="grid grid-cols-[1.5fr_0.5fr] gap-6">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-3 rounded-md bg-white p-4 pb-7">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <InputField
                            id="customerName"
                            type="text"
                            placeholder="Customer Name"
                            className="h-8 resize-none bg-white"
                            maxLength={120}
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
                    name="phoneNumberPrimary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile No.</FormLabel>
                        <FormControl>
                          <InputField
                            id="phoneNumberPrimary"
                            placeholder="Mobile No."
                            type="tel"
                            className="h-8 resize-none bg-white"
                            maxLength={10}
                            onKeyDown={allowOnlyNumbers}
                            onPaste={handleNumberPaste}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Alternate Number */}
                  <FormField
                    control={form.control}
                    name="phoneNumberSecondary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate No.</FormLabel>
                        <FormControl>
                          <InputField
                            id="phoneNumberSecondary"
                            placeholder="Alternate No."
                            type="tel"
                            className="h-8 resize-none bg-white"
                            maxLength={10}
                            onKeyDown={allowOnlyNumbers}
                            onPaste={handleNumberPaste}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {productsFields.map((item, index) => (
                  <div
                    className="relative grid grid-cols-4 gap-2 rounded-md bg-white p-4"
                    key={item.id}
                  >
                    {/* Product Selection */}
                    <div className="col-span-3 flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name={`products.${index}.productId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <Combobox
                              id="selectBookProduct"
                              className="w-[full] text-sm font-medium text-[#000000]"
                              isOptionLoading={allProductLoading}
                              options={(allProducts || []).filter(
                                (product) =>
                                  !watchProduct.some(
                                    (selected) =>
                                      selected.productId === product.value,
                                  ),
                              )}
                              value={
                                allProducts.find(
                                  (product) =>
                                    product.value.toString() ===
                                    field.value.toString(),
                                )?.label ?? ""
                              }
                              setValue={(value) => {
                                handleSelectProduct(value, index);
                                form.setValue(
                                  `products.${index}.productId`,
                                  value.value,
                                );
                              }}
                              search={searchProduct}
                              setSearch={setSearchProduct}
                              label="Select a product"
                            />
                            {!watchProduct[index]?.productId &&
                              form.formState.errors.products?.[index]
                                ?.perUnitCost &&
                              !watchProduct[index]?.productName && (
                                <p className="select-none text-[0.8rem] font-medium text-red-500">
                                  Please select a product.
                                </p>
                              )}
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex h-[54px] flex-col gap-2">
                      <FormField
                        control={form.control}
                        name={`products.${index}.stock`}
                        render={() => (
                          <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                              <InputField
                                id="stock"
                                disabled
                                className="resize-none bg-white"
                                value={`${Number(
                                  watchProduct?.[index]?.stock,
                                )}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Price Input */}
                    <div className="flex h-[54px] flex-col gap-2">
                      <FormField
                        control={form.control}
                        name={`products.${index}.perUnitCost`}
                        render={() => (
                          <FormItem>
                            <FormLabel>Per Unit Cost</FormLabel>
                            <FormControl>
                              <InputField
                                id="amount"
                                disabled
                                className="resize-none bg-white"
                                value={`${Number(
                                  watchProduct?.[index]?.perUnitCost || 0,
                                ).toLocaleString("en-IN", {
                                  maximumFractionDigits: 3,
                                })}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex h-[54px] flex-col gap-2">
                      <FormField
                        control={form.control}
                        name={`products.${index}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <InputField
                                id="unit"
                                className="resize-none bg-white"
                                type="number"
                                {...field}
                                value={field.value ?? ""} // fallback for undefined
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex h-[54px] flex-col gap-2">
                      <FormItem>
                        <FormLabel>Total</FormLabel>
                        <FormControl>
                          <InputField
                            id="total"
                            disabled={true}
                            className="resize-none bg-white"
                            type="number"
                            value={
                              Number(watchProduct[index].perUnitCost) *
                              Number(watchProduct[index].unit)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>
                    {productsFields.length > 1 && (
                      <button
                        id="remove"
                        onClick={() => handleDeleteProduct(index)}
                        className=" right-0 text-sm font-medium text-red-500"
                        type="button"
                      >
                        Remove
                      </button>
                    )}

                    {showModal && deleteIndex === index && (
                      <div className="fixed inset-0 z-40 bg-gray-400 bg-opacity-20">
                        <ConfirmationModal
                          isOpen={showModal}
                          title="Delete item from booking?"
                          message="Are you sure you want to delete this product from the booking?"
                          confirmButtonText="Yes, Delete"
                          onConfirm={confirmDelete}
                          onCancel={cancelDelete}
                        />
                      </div>
                    )}
                    <div className="col-span-3 text-[0.8rem] font-medium text-destructive">
                      {conflicts.length > 0 &&
                        conflicts
                          .filter(
                            (conflict: conflictProps) =>
                              conflict?.productId ===
                              watchProduct[index]?.productId,
                          )
                          .map((conflict: conflictProps, i: number) => (
                            <span key={i}>
                              Insufficient stock for the selected product. You
                              requested {conflict.required} units, but only{" "}
                              {conflict.available} are available.
                            </span>
                          ))}
                    </div>
                  </div>
                ))}

                <div className="mt-2 flex items-center justify-between">
                  {addError && (
                    <span className="text-left text-sm font-medium text-red-500">
                      {addError}
                    </span>
                  )}
                  <button
                    id="addItem"
                    className="ml-auto flex h-8 items-center justify-end gap-2 rounded-lg bg-black p-4 px-6 text-sm font-medium text-white"
                    onClick={handleIncreamentProduct}
                    type="button"
                  >
                    <Plus className="h-4 w-4 rounded-full border border-white" />
                    Add Item
                  </button>
                  <div ref={bottomRef} />
                </div>
              </div>

              <div className="flex-col">
                <div className="grid gap-4 rounded-md bg-white p-4">
                  {/* Deposit Amount */}

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <div className="focus-within:border-1 relative overflow-hidden rounded-lg border pb-5 focus-within:border-black focus-within:ring-0 focus-within:ring-black">
                            <Textarea
                              id="notes"
                              {...field}
                              maxLength={500}
                              onKeyDown={allowOnlyLetterNumber}
                            />
                            <p className="absolute bottom-0 left-2 text-xs text-[#8C8C8C]">
                              {watchNotes + 0} / 500
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`gstNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST Number (Billing to) </FormLabel>
                        <FormControl>
                          <InputField
                            id="gstNumber"
                            placeholder="GST Number"
                            className="resize-none bg-white"
                            type="string"
                            {...field}
                            value={field.value ?? ""} // fallback for undefined
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`gstRate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST Rate %</FormLabel>
                        <FormControl>
                          <InputField
                            id="gstRate"
                            placeholder="GST Rate %"
                            className="resize-none bg-white"
                            type="number"
                            {...field}
                            value={field.value ?? ""} // fallback for undefined
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`discountAmount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Amount</FormLabel>
                        <FormControl>
                          <InputField
                            id="discountAmount"
                            placeholder="Discount Amount"
                            className="resize-none bg-white"
                            type="number"
                            {...field}
                            value={field.value ?? ""} // fallback for undefined
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4 rounded-lg border border-gray-200 bg-white">
                  <div className="border-b px-4 py-[10px]">
                    <span id="orderSummary" className="text-sm font-semibold">
                      Order Summary
                    </span>
                  </div>

                  <div className="flex flex-row justify-between px-4 py-[11px] text-sm font-medium hover:bg-[#FAFAFA]">
                    <span id="amount" className="pt-0.5">
                      Amount
                    </span>
                    <span className="text-sm font-semibold text-black">
                      ₹{"   "}
                      {form
                        .getValues("products")
                        ?.reduce(
                          (sum, product) =>
                            sum +
                            Number(product?.perUnitCost ?? 0) *
                              Number(product?.unit),
                          0,
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  {Number(form.watch("gstRate")) > 0 && (
                    <div className="flex flex-row justify-between px-4 py-[11px] text-sm font-medium hover:bg-[#FAFAFA]">
                      <span id="deposit" className="pt-0.5">
                        SGST
                      </span>
                      <span className="text-sm font-semibold text-[#E58E02]">
                        ₹{" "}
                        {(
                          (form
                            .getValues("products")
                            ?.reduce(
                              (sum, product) =>
                                sum +
                                Number(product?.perUnitCost ?? 0) *
                                  Number(product?.unit ?? 0),
                              0,
                            ) *
                            Number(form.watch("gstRate") ?? 0)) /
                          200
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {Number(form.watch("gstRate")) > 0 && (
                    <div className="flex flex-row justify-between px-4 py-[11px] text-sm font-medium hover:bg-[#FAFAFA]">
                      <span id="deposit" className="pt-0.5">
                        CGST
                      </span>
                      <span className="text-sm font-semibold text-[#E58E02]">
                        ₹{" "}
                        {(
                          (form
                            .getValues("products")
                            ?.reduce(
                              (sum, product) =>
                                sum +
                                Number(product?.perUnitCost ?? 0) *
                                  Number(product?.unit ?? 0),
                              0,
                            ) *
                            Number(form.watch("gstRate") ?? 0)) /
                          200
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {Number(form.watch("discountAmount")) > 0 && (
                    <div className="flex flex-row justify-between px-4 py-[11px] text-sm font-medium hover:bg-[#FAFAFA]">
                      <span id="deposit" className="pt-0.5">
                        Discount
                      </span>
                      <span className="text-sm font-semibold text-green-500">
                        - ₹{" "}
                        {Number(form.watch("discountAmount") ?? 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {/* Total Amount */}
                  <div className="flex flex-row justify-between bg-[#FAFAFA] px-4 py-[11px] text-sm font-medium hover:bg-[#FAFAFA]">
                    <span id="totalamount" className="pt-0.5">
                      Total
                    </span>
                    <span className="text-sm font-semibold text-[#000000]">
                      ₹{" "}
                      {(
                        form
                          .getValues("products")
                          ?.reduce(
                            (sum, product) =>
                              sum +
                              Number(product?.perUnitCost ?? 0) *
                                Number(product?.unit ?? 0),
                            0,
                          ) +
                        (form
                          .getValues("products")
                          ?.reduce(
                            (sum, product) =>
                              sum +
                              Number(product?.perUnitCost ?? 0) *
                                Number(product?.unit ?? 0),
                            0,
                          ) *
                          Number(form.watch("gstRate") ?? 0)) /
                          100 -
                        Number(form.watch("discountAmount") ?? 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-end gap-4 pt-6 md:flex-row">
                  <Button
                    id="cancel"
                    onClick={handleCancelBooking}
                    variant="outline"
                    type="button"
                    className="h-8 w-full rounded-lg border border-black text-black"
                  >
                    Cancel
                  </Button>
                  <Button
                    id="saveEditBook"
                    type="submit"
                    disabled={Boolean(isPending)}
                    className="h-8 w-full rounded-lg border bg-black text-white hover:bg-black hover:text-white"
                  >
                    {!isPending ? (
                      formType === "edit" ? (
                        "Save"
                      ) : (
                        "Order Now"
                      )
                    ) : (
                      <CircularProgressLoader size={20} />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateBookingPage;
