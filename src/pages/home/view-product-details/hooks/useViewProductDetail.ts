import  { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { viewProductBreadCrumb } from "../constants";
import { useGetProductById } from "@/services/queries";

export const useViewProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.pathname.split("/").pop();
  const {
    data: productsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetProductById(productId as string);

  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    if (productId) {
      refetch();
    }
  }, [productId, refetch]);

  useEffect(() => {
    if (!productId) {
      return;
    }
    if (!isFetching && (!productsData || !productsData.data)) {
      navigate("/products", { replace: true });
    } else {
      setProduct(productsData?.data || undefined);
    }
  }, [productsData, productId, isFetching, navigate]);

  return {
    isLoading: isLoading || isFetching,
    productsData,
    product,
    viewProductBreadCrumb,
  };
};
