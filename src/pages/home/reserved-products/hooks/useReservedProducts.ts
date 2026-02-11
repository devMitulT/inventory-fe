import { useGetNotifications } from "@/services/queries";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useState } from "react";

export const useReservedProducts = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);

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

  return {
    handleNavigateToCreateBooking,
    allNotifications,
    isNotification,
    handlePageChange,
  };
};
