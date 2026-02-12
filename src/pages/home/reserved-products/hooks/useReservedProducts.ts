import { useGetNotifications } from "@/services/queries";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useEffect, useState } from "react";
import { CalendarDataType } from "../constants";

export const useReservedProducts = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [selectedData, setSelectedData] = useState<CalendarDataType>();
  const [selectedProduct, setSelectedProduct] = useState<string>();
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const { data: allNotifications, isLoading: isNotification } =
    useGetNotifications(page);

  const handleNavigateToCreateBooking = () => {
    navigate(ROUTES.CREATE_BOOKING, {
      state: {
        formType: "create",
      },
    });
  };

  const handleNavigateToUpdateBooking = () => {
    navigate(ROUTES.EDIT_BOOKING, {
      state: {
        initialData: { ...selectedData, productId: selectedProduct },
        formType: "edit",
      },
    });
  };

  useEffect(() => {
    if (selectedData) {
      handleNavigateToUpdateBooking();
    }
  }, [selectedData]);

  return {
    handleNavigateToCreateBooking,
    allNotifications,
    isNotification,
    handlePageChange,
    selectedData,
    selectedProduct,
    setSelectedData,
    setSelectedProduct,
  };
};
