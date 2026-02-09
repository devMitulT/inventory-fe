import { z } from "zod";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateBooking,
  useDeleteBooking,
  useGetProductsBySku,
  useUpdateBooking,
} from "@/services/queries";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createBookingBreadScrum,
  editBookingBreadScrum,
  productBookingSchema,
} from "../constants";
import { ROUTES } from "@/constants";
import useDebounce from "@/hooks/useDebounce";
import { CustomError } from "@/lib/axios-utils";

export const useCreatProductBooking = () => {
  // Inside your component
  const { toast } = useToast();
  const navigate = useNavigate();
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const { initialData, products, formType } = location.state || {};
  const { mutateAsync: createBooking } = useCreateBooking();
  const { mutateAsync: updateBooking } = useUpdateBooking();
  const [allProducts, setAllProducts] = useState<SelectOptions[]>([]);
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [conflicts, setConflicts] = useState([]);
  const [laundryConflict, setLaundryConflict] = useState([]);
  const [addError, setAddError] = useState("");

  const [imageErrors, setImageErrors] = React.useState<{
    [productId: string]: boolean;
  }>({});
  const filterBySky = useDebounce(searchProduct);
  const { data: allProductsData, isLoading: allProductLoading } =
    useGetProductsBySku(filterBySky);
  const customerDetails = initialData?.text
    ? initialData?.text.split("\n").map((part: any) => part.trim()) || ["", ""]
    : "";

  const form = useForm<z.infer<typeof productBookingSchema>>({
    resolver: zodResolver(productBookingSchema),
    defaultValues: initialData
      ? {
          products:
            initialData?.products?.map((ele: any) => ({
              productId: ele?.productId?._id ?? "",
              perUnitCost: ele?.perUnitCost ?? 0,
              productName: ele?.productId?.name ?? "",
              unit: ele?.unit ?? "",
            })) ?? [],
          customerName: initialData?.text
            ? customerDetails?.[0]
            : initialData?.customer?.customerName,
          notes: initialData?.text ? customerDetails?.[1] : initialData?.notes,
          gstRate: initialData?.text
            ? customerDetails?.[2]
            : initialData?.gstRate,
          phoneNumberPrimary: initialData?.text
            ? customerDetails?.[3]
            : initialData?.customer?.phoneNumberPrimary,
          phoneNumberSecondary: initialData?.text
            ? customerDetails?.[4]
            : initialData?.customer?.phoneNumberSecondary,
          amount: initialData?.text
            ? customerDetails?.[5]
            : initialData?.amount.toString(),
          gstNumber: initialData?.text
            ? customerDetails?.[6]
            : initialData?.customer.gstNumber,
        }
      : {
          products: [
            {
              productId: "",
              perUnitCost: "",
              productName: "",
              unit: "",
            },
          ],
          customerName: "",
          notes: "",
          phoneNumberPrimary: "",
          phoneNumberSecondary: "",
          amount: "",
          gstNumber: "",
        },
  });
  const { control } = form;
  const { fields: productsFields, remove } = useFieldArray({
    control,
    name: "products",
  });

  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [isPending, setIsPending] = useState<Boolean>(false);

  const [deposite, setDeposite] = useState(products?.depositeAmount);
  const [queries, setQueries] = useState<string[]>(
    new Array(initialData?.products?.length || 1).fill(""),
  );

  const { mutateAsync: deleteBooking, isPending: isDeleting } =
    useDeleteBooking();

  // Recalculate total when prices changes
  const handleDeleteBooking = async () => {
    try {
      const data = await deleteBooking(initialData?.id);

      toast({
        title: "Booking Delete Successfully",
        description:
          data?.message || "Your booking has been deleted successfully.",
        duration: 2000,
      });

      setIsOpen(false);
      navigate(ROUTES.HOME);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred.";

      toast({
        title: "Error Deleting Booking",
        description: errorMessage,
        duration: 2000,
      });
    }
  };
  const onSubmit = async (value: z.infer<typeof productBookingSchema>) => {
    const formateProducts = value.products.map((e) => {
      return {
        productId: e.productId,
        perUnitCost: e.perUnitCost,
        unit: e.unit,
      };
    });
    if (formType === "edit") {
      try {
        setIsPending(true);
        const products = form.getValues("products") || [];
        const gstRate = Number(form.watch("gstRate") ?? 0);

        const baseAmount = products.reduce(
          (sum, product) =>
            sum +
            Number(product?.perUnitCost ?? 0) * Number(product?.unit ?? 0),
          0,
        );

        const totalAmount = baseAmount + (baseAmount * gstRate) / 100;

        const data = await updateBooking({
          ...value,
          id: initialData?.id || initialData?._id || "",
          products: formateProducts,
          amount: totalAmount,
        });

        toast({
          title: "Booking Update Successfully",
          description:
            data?.message || "Your booking has been updated successfully.",
          duration: 2000,
        });
        setIsOpen(false);
        navigate(`${ROUTES.VIEW_ORDER.replace(":id", data?.data._id)}`);
      } catch (error: unknown) {
        const err = error as CustomError;

        const errorMessage = err.message || "An unknown error occurred.";

        if (
          errorMessage === "Some products have overlapping bookings." &&
          err?.data?.conflicts
        ) {
          setConflicts(err.data.conflicts);
        }
        if (
          errorMessage === "Some products are currently in laundry." &&
          err?.data?.conflicts
        ) {
          setLaundryConflict(err.data.conflicts);
        } else {
          toast({
            title: "Error Updating Booking",
            description: errorMessage,
            duration: 2000,
          });
        }
      } finally {
        setIsPending(false);
      }
    }
    if (formType === "create") {
      const products = form.getValues("products") || [];
      const gstRate = Number(form.watch("gstRate") ?? 0);

      const baseAmount = products.reduce(
        (sum, product) =>
          sum + Number(product?.perUnitCost ?? 0) * Number(product?.unit ?? 0),
        0,
      );

      const totalAmount = baseAmount + (baseAmount * gstRate) / 100;
      try {
        setIsPending(true);

        const data = await createBooking({
          ...value,
          id: initialData?.id || "",
          products: formateProducts,
          amount: totalAmount,
        });

        toast({
          title: "Booking Created Successfully",
          description:
            data?.message || "Your booking has been created successfully.",
          duration: 2000,
        });
        setIsOpen(false);
        navigate(`${ROUTES.VIEW_ORDER.replace(":id", data?.data._id)}`);
      } catch (error: unknown) {
        const err = error as CustomError;

        const errorMessage = err.message || "An unknown error occurred.";

        if (
          errorMessage === "Some products have insufficient stock." &&
          err?.data?.conflicts
        ) {
          setConflicts(err.data.conflicts);
        } else {
          toast({
            title: "Error Creating Booking",
            description: errorMessage,
            duration: 2000,
          });
        }
      } finally {
        setIsPending(false);
      }
    }
  };

  const handleIncreamentProduct = () => {
    const products = form.getValues("products") || [];
    const lastProduct = products[products.length - 1];

    const isLastProductValid =
      lastProduct?.productId && lastProduct?.perUnitCost && lastProduct?.unit;

    if (!isLastProductValid) {
      setAddError("Please enter all the product details.");
      return;
    }
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    setAddError("");

    const newProduct = {
      productName: "",
      productId: "",
      perUnitCost: "",
      unit: "",
      stock: "",
    };

    form.setValue("products", [...products, newProduct], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleDeleteProduct = (index: number) => {
    setDeleteIndex(index);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      remove(deleteIndex);
      setDeleteIndex(null);
      setShowModal(false);
    }
  };

  const cancelDelete = () => {
    setDeleteIndex(null);
    setShowModal(false);
  };

  const handleQueryChange = (index: any, query: any) => {
    const newQueries = [...queries];
    newQueries[index] = query;
    setQueries(newQueries);
  };

  const handleSelectProduct = (
    product: {
      label: string;
      value: string;
    },
    index: number,
  ) => {
    const productId = product.value;
    const findProduct = allProductsData?.find(
      (product: any) => product._id === productId,
    );

    const updatedProducts = form.getValues("products").map((ele, idx) =>
      idx === index
        ? {
            ...ele,
            productId: findProduct?._id,
            perUnitCost: findProduct?.perUnitCost,
            productName: product.label,
            stock: findProduct?.stock,
          }
        : ele,
    );

    const totalAmount = updatedProducts.reduce(
      (acc, curr) => acc + Number(curr.perUnitCost || 0),
      0,
    );

    form.setValue("products", updatedProducts);
    form.setValue("amount", totalAmount.toString());

    setConflicts([]);
    setLaundryConflict([]);
  };

  useEffect(() => {
    const products = form.watch("products");

    products.map((el: any, index: number) => {
      const findProduct = allProductsData?.find(
        (product: any) => product._id === el.productId,
      );
      const updatedProducts = form.getValues("products").map((ele, idx) =>
        idx === index
          ? {
              ...ele,
              stock: findProduct?.stock,
            }
          : ele,
      );
      form.setValue("products", updatedProducts);
    });
  }, [allProductLoading]);

  const watchNotes = form.watch("notes")?.length || 0;
  const watchProduct = form.watch("products");

  const handleCancelBooking = () => navigate(ROUTES.ORDERS);

  useEffect(() => {
    if (!allProductLoading && allProductsData?.length >= 1) {
      const formattedProducts = allProductsData.map((item: any) => ({
        label: `${item.sku} : ${item.name}`,
        value: item._id,
      }));
      setAllProducts(formattedProducts);
    } else if (!allProductLoading) {
      toast({
        title: "Product",
        description: "No Product Found !",
        duration: 2000,
      });
    }
  }, [allProductLoading, allProductsData]);

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  };

  return {
    formType,
    form,
    onSubmit,
    products,
    setQueries,
    handleQueryChange,
    queries,
    handleDeleteBooking,
    handleIncreamentProduct,
    totalAmount: `${(Number(form.getValues().amount) || 0).toFixed(2)}`,
    initialData,
    isPending,
    setIsOpen,
    isOpen,
    setDeposite,
    isDeleting,
    deposite,
    handleSelectProduct,
    watchNotes,
    createBookingBreadScrum,
    productsFields,
    watchProduct,
    handleDeleteProduct,
    handleCancelBooking,
    searchProduct,
    setSearchProduct,
    allProductsData,
    allProductLoading,
    allProducts,
    conflicts,
    laundryConflict,
    formatDate,
    location,
    showModal,
    deleteIndex,
    confirmDelete,
    cancelDelete,
    bottomRef,
    imageErrors,
    setImageErrors,
    editBookingBreadScrum,
    addError,
  };
};
