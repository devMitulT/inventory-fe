import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useDeleteProduct,
  useGetProducts,
  useGetArchivedProducts,
  useArchivedProduct,
} from "@/services/queries";
import { archivedColumns, productColums } from "../constants";
import useDebounce from "@/hooks/useDebounce";

export const useProducts = () => {
  const { toast } = useToast();
  // pagination
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("available");
  const searchBySku = useDebounce(search);

  const [productDelete, setProductDelete] = useState<string>("");
  const [productToArchived, setProductToArchived] = useState<string | null>(
    null
  );

  const { mutateAsync: deleteProduct, isPending: isDeletingProduct } =
    useDeleteProduct();
  const { mutateAsync: archivedProduct, isPending: isRestoring } =
    useArchivedProduct();
  const isArchived = selectedStatus === "archived";

  const {
    data: productsData,
    isFetching: productLoading,
    refetch: refetchAllProducts,
  } = isArchived
    ? useGetArchivedProducts(page, searchBySku, selectedStatus)
    : useGetProducts(page, searchBySku);
  useEffect(() => {
    refetchAllProducts();
  }, [selectedStatus]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
  };

  useEffect(() => {
    if (!productLoading && productsData?.data.length === 0 && page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  }, [productsData, productLoading, page]);

  const handleProductDelete = (id: string) => setProductDelete(id);

  const columns = productColums(handleProductDelete);

  // handle pagination change
  const handlePageChange = (newPage: number) => setPage(newPage);

  // handle search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDeleteProduct = async () => {
    try {
      const data = await deleteProduct(productDelete);
      refetchAllProducts();
      setProductDelete("");
      toast({
        title: "Product Delete Successfully",
        description:
          data?.message || "Your product has been deleted successfully.",
        duration: 2000,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred.";

      toast({
        title: "Error Deleting Product",
        description: errorMessage,
        duration: 2000,
      });
    }
  };

  const handleProductArchived = async (productToArchived: any) => {
    if (!productToArchived) return;
    try {
      await archivedProduct(productToArchived);
      toast({
        title: "Product Restored",
        description: "Product has been successfully restored.",
      });

      refetchAllProducts();
    } catch (err: any) {
      toast({
        title: "Restore Failed",
        description: err.message || "Could not restore product.",
      });
    } finally {
      setProductToArchived(null);
    }
  };

  return {
    columns,
    archivedColumns,
    productsData,
    productLoading,
    productDelete,
    handleProductDelete,
    isDeletingProduct,
    handleDeleteProduct,
    handlePageChange,
    handleSearchChange,
    selectedStatus,
    setSelectedStatus,
    handleStatusChange,
    productToArchived,
    setProductToArchived,
    handleProductArchived,
    isRestoring,
  };
};
