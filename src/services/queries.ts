import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createBooking,
  createProduct,
  deleteBooking,
  deleteProduct,
  signIn,
  changePassword,
  updateBooking,
  updateProduct,
  getProducts,
  getOrders,
  getProductById,
  searchProductBySku,
  getOrderById,
  getOrganizationInfo,
  updateOrganization,
  archivedProduct,
  getArchivedProducts,
  getNotifications,
  createProductFromCSV,
  getOrgUsers,
  createOrgUser,
  toggleOrgUserActive,
  getMyProfile,
  updateMyProfile,
  getStatistics,
  getPublicReceipt,
} from "./api";
import { KEYS } from "@/constants";

export const useGetProducts = (page: number, search: string) => {
  return useQuery({
    queryKey: [KEYS.GET_ALL_PRODUCTS, page, search],
    queryFn: () => getProducts(page, search),
  });
};

export const useGetProductsBySku = (sku: string) => {
  return useQuery({
    queryKey: [KEYS.GET_PRODUCTS_SKU],
    queryFn: () => searchProductBySku(sku),
    retry: false,
    staleTime: 0,
  });
};

export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: [id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    retry: false,
    staleTime: 1 * 1000,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: ProductBooking) => {
      return createBooking(bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [KEYS.GET_BOOKINGS_FOR_PRODUCT],
      });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: ProductBooking) => {
      return updateBooking(bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [KEYS.GET_BOOKINGS_FOR_PRODUCT],
      });
      queryClient.invalidateQueries({
        queryKey: [KEYS.GET_BOOKING_ID],
      });
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bid: string | undefined) => {
      return deleteBooking(bid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [KEYS.GET_BOOKINGS_FOR_PRODUCT],
      });
    },
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: (bdata: { email: string; password: string }) => {
      return signIn(bdata);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (bdata: { oldPassword: string; newPassword: string }) => {
      return changePassword(bdata);
    },
  });
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: (bodyData: {
      name: string;
      description: string;
      perUnitCost: string | number;
      colour?: string[] | undefined;
      size?: string[] | undefined;
      gender?: string | undefined;
      sku: string;
      stock: number | string;
      thresholdStock: number | string;
      measurementType: string;
    }) => {
      return createProduct(bodyData);
    },
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: (bodyData: updateProduct) => {
      return updateProduct(bodyData);
    },
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: (bid: string) => {
      return deleteProduct(bid);
    },
  });
};

export const useArchivedProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archivedProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.GET_ARCHIVED_PRODUCTS] });
    },
  });
};

export const useGetArchivedProducts = (
  page: number,
  search: string,
  status: string,
) => {
  return useQuery({
    queryKey: [KEYS.GET_ALL_PRODUCTS, "archived", page, search, status],
    queryFn: () => getArchivedProducts(page, search, status),
    staleTime: 0,
  });
};

export const useGetOrders = (
  {
    page,
    primaryPhn,
    date,
    billedBy,
  }: {
    page: number;
    primaryPhn: string;
    date: {
      from: string;
      to: string;
    };
    billedBy?: string;
  },
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [KEYS.GET_ORDERS, page, primaryPhn, date, billedBy ?? ""],
    queryFn: () => getOrders({ page, primaryPhn, date, billedBy }),
    enabled,
    staleTime: 0,
  });
};

export const useGetBookingById = (bid: string) => {
  return useQuery({
    queryKey: [KEYS.GET_BOOKING_ID, bid],
    queryFn: () => getOrderById(bid),
    enabled: !!bid,
    retry: false,
    staleTime: 0,
  });
};

export const useGetPublicReceipt = (bid: string) => {
  return useQuery({
    queryKey: ["PUBLIC_RECEIPT", bid],
    queryFn: () => getPublicReceipt(bid),
    enabled: !!bid,
    retry: false,
    staleTime: 0,
  });
};

export const useGetOrgnaztionInfo = () => {
  return useQuery({
    queryKey: [KEYS.GET_ORGANIZATION_INFO],
    queryFn: () => getOrganizationInfo(),
    retry: false,
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bodyData: OrganizationInfo) => {
      return updateOrganization(bodyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [KEYS.GET_ORGANIZATION_INFO],
      });
    },
  });
};

export const useGetNotifications = (page: number) => {
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: () => getNotifications(page),
  });
};

export const useCreateProductFromCSV = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bdata: CSVProps) => {
      return createProductFromCSV(bdata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [KEYS.GET_ALL_PRODUCTS],
      });
    },
  });
};

// Users (super-admin)
export const useGetOrgUsers = () => {
  return useQuery({
    queryKey: [KEYS.GET_ORG_USERS],
    queryFn: () => getOrgUsers(),
    staleTime: 0,
  });
};

export const useCreateOrgUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bdata: NewUserPayload) => createOrgUser(bdata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.GET_ORG_USERS] });
    },
  });
};

export const useToggleOrgUserActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleOrgUserActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.GET_ORG_USERS] });
    },
  });
};

// My Account
export const useGetMyProfile = () => {
  return useQuery({
    queryKey: [KEYS.GET_MY_PROFILE],
    queryFn: () => getMyProfile(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bdata: MyProfileUpdate) => updateMyProfile(bdata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.GET_MY_PROFILE] });
    },
  });
};

// Statistics
export const useGetStatistics = ({
  startDate,
  endDate,
  gender,
  billedBy,
}: {
  startDate: string;
  endDate: string;
  gender?: string;
  billedBy?: string;
}) => {
  return useQuery({
    queryKey: [
      KEYS.GET_STATISTICS,
      startDate,
      endDate,
      gender ?? "",
      billedBy ?? "",
    ],
    queryFn: () =>
      getStatistics({ startDate, endDate, gender, billedBy }),
    enabled: !!startDate && !!endDate,
    staleTime: 0,
  });
};
