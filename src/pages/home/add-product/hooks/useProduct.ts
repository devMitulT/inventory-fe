import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCreateProduct } from "@/services/queries";

import {
  createProductFormSchema,
  initialProductData,
  breadCrumbData,
} from "../constants";
import { ROUTES } from "@/constants";

export const useProduct = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutateAsync: createProduct, isPending: productCreating } =
    useCreateProduct();

  const form = useForm({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: initialProductData,
  });

  async function handleCreateProduct(
    values: z.infer<typeof createProductFormSchema>
  ) {
    try {
      const data = await createProduct(values);

      toast({
        title: "Product Created Successfully",
        description:
          data?.message || "Your product has been created successfully.",
        duration: 2000,
      });
      navigate(ROUTES.PRODUCTS);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred.";

      toast({
        title: "Error Creating Product",
        description: errorMessage,
        duration: 2000,
      });
    } finally {
    }
  }

  const watchDescription = form.watch("description").length;
  const handleProductCancel = () => navigate(-1);

  return {
    form,
    handleCreateProduct,
    handleProductCancel,
    breadCrumbData,
    watchDescription,
    productCreating,
  };
};
