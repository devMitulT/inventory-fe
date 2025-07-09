import { useEffect, useState } from "react";

import { useGetNotifications, useGetProductsBySku } from "@/services/queries";
import { useNavigate } from "react-router-dom";
import { CalendarDataType } from "../constants";
import { ROUTES } from "@/constants";

export const useReservedProducts = () => {
  const navigate = useNavigate();

  const [selectedData, setSelectedData] = useState<CalendarDataType>();
  const [selectedProduct, setSelectedProduct] = useState<string>();

  const { data: allProductsData } = useGetProductsBySku("");

  const { data: allNotifications, isLoading: isNotification } =
    useGetNotifications();

  const handleNavigateToCreateBooking = () => {
    navigate(ROUTES.CREATE_BOOKING, {
      state: {
        initialData: selectedData,
        products: allProductsData,
        formType: "create",
      },
    });
  };

  const handleNavigateToUpdateBooking = () => {
    navigate(ROUTES.EDIT_BOOKING, {
      state: {
        initialData: { ...selectedData, productId: selectedProduct },
        products: allProductsData,
        formType: "edit",
      },
    });
  };

  const handleNavigateToViewBooking = (id: string) => {
    if (!id) {
      console.error("ID is undefined. Cannot navigate.");
      return;
    }

    const path = ROUTES.VIEW_ORDER.replace(":id", id);
    navigate(path);
  };

  useEffect(() => {
    if (selectedData) {
      handleNavigateToUpdateBooking();
    }
  }, [selectedData]);

  return {
    setSelectedData,
    selectedProduct,
    handleNavigateToCreateBooking,
    handleNavigateToViewBooking,
    setSelectedProduct,
    allNotifications,
    isNotification,
  };
};
