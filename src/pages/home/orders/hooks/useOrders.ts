import React, { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import { useDeleteBooking, useGetOrders } from "@/services/queries";
import { ordersColums } from "../constants";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const useOrders = () => {
  // pagination
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const { toast } = useToast();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const [orderDelete, setOrderDelete] = useState<string>("");

  const { mutateAsync: deleteOrder, isPending: isBookingDeleting } =
    useDeleteBooking();

  const handleFromDateChange = (newDate: Date | undefined) => {
    setDate(() => ({
      from: newDate,
      to: undefined, // fallback in case prev is undefined
    }));
    setPage(1);
  };

  const handleToDateChange = (newDate: Date | undefined) => {
    setDate((prev) => ({
      from: prev?.from ?? new Date(), // fallback in case prev is undefined
      to: newDate,
    }));
  };

  const hasBothDates = !!date?.from && !!date?.to;

  const formattedFrom = formatDate(date?.from as Date);
  const formattedTo = formatDate(date?.to as Date);

  const { data: filteredOrderData, isFetching: filteredLoading } = useGetOrders(
    {
      page,
      primaryPhn: debouncedSearch,
      date: {
        from: formattedFrom,
        to: formattedTo,
      },
    },
    hasBothDates
  );
  const {
    data: orderData,
    isFetching: orderLoading,
    refetch: refetchOrder,
  } = useGetOrders(
    {
      page,
      primaryPhn: debouncedSearch,
      date: {
        from: "",
        to: "",
      },
    },
    !hasBothDates
  );
  useEffect(() => {
    if (hasBothDates) {
      setPage(1);
    }
  }, [hasBothDates]);

  const orderDatas = hasBothDates ? filteredOrderData : orderData;
  const orderLoadings = hasBothDates ? filteredLoading : orderLoading;
  const handleOrder = (id: string) => setOrderDelete(id);
  const columns = ordersColums(handleOrder);

  // handle search changes
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(handler);
  }, [search]);

  // handle pagination change
  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleDeleteOrder = async () => {
    try {
      const data = await deleteOrder(orderDelete);
      refetchOrder();
      setOrderDelete("");
      toast({
        title: "Booking Delete Successfully",
        description:
          data?.message || "Your Booking(Order) has been deleted successfully.",
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

  return {
    columns,
    orderDatas,
    orderLoadings,
    handlePageChange,
    handleDeleteOrder,
    date,
    handleSearchChange,
    handleFromDateChange,
    handleToDateChange,
    isBookingDeleting,
    orderDelete,
    handleOrder,
  };
};
