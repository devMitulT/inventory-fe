import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

import { useGetProductById } from "@/services/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProduct } from "@/services/queries";

import { EditProductProps, editProductFormSchema, Product } from "../constants";
import { ROUTES } from "@/constants";

export const useEditProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.pathname.split("/").pop();
  const { data: productsData, isLoading } = useGetProductById(
    productId as string,
  );
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    if (!productId) {
      return;
    }
    if (!isLoading && (!productsData || !productsData.data)) {
      navigate("/products", { replace: true });
    } else {
      setProduct(productsData?.data || undefined);
    }
  }, [productsData, productId, isLoading, navigate]);
  useEffect(() => {
    if (!productsData || !productId) return;
    if (productsData?.data && !isLoading) {
      let isSkuAvailable = productsData?.data?.sku.split("-")?.[0];
      setProduct({
        ...productsData?.data,
        sku: isSkuAvailable,
      });
    }
  }, [productsData, productId, isLoading]);

  return {
    product,
    isLoading,
  };
};

// contain the product information
export const useEditProductDetails = ({ product }: EditProductProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutateAsync: updateProduct, isPending: isUpdatingProduct } =
    useUpdateProduct();

  const form = useForm({
    resolver: zodResolver(editProductFormSchema),
    defaultValues: {
      name: product?.name,
      description: product?.description,
      perUnitCost: String(product?.perUnitCost),
      colour: product?.colour,
      sku: product?.sku,
      measurementType: product.measurementType,
      stock: String(product?.stock),
      thresholdStock: String(product?.thresholdStock),
      gender: String(product?.gender),
      size: String(product?.size),
    },
  });

  async function onSubmit(values: z.infer<typeof editProductFormSchema>) {
    try {
      const data = await updateProduct({
        ...values,
        _id: product._id,
      });
      toast({
        title: "Product Updated Successfully",
        description:
          data?.message || "Your product has been updated successfully.",
        duration: 2000,
      });
      navigate(`${ROUTES.PRODUCT_DETAILS.replace(":id", product._id)}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred.";

      toast({
        title: "Error Updating Product",
        description: errorMessage,
        duration: 2000,
      });
    }
  }

  const watchDescription = form.watch("description").length;
  const handleCancel = () => navigate(-1);

  return {
    form,
    onSubmit,
    handleCancel,
    watchDescription,
    isUpdatingProduct,
  };
};
