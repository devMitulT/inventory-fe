import { request } from "@/lib/axios-utils";

//Order

export const createBooking = async (bodyData: ProductBooking): Promise<any> => {
  return await request({
    url: "/order/orders",
    method: "POST",
    data: bodyData,
  });
};

export const updateBooking = async (bodyData: ProductBooking): Promise<any> => {
  return await request({
    url: `order/orders/${bodyData.id}`,
    method: "PUT",
    data: bodyData,
  });
};

export const deleteBooking = async (bid: string | undefined): Promise<any> => {
  return request({ url: `/order/orders/${bid}`, method: "DELETE" });
};

export const getOrders = async ({
  page,
  primaryPhn,
  date,
}: {
  page: number;
  primaryPhn: string;
  date: {
    from: string;
    to: string;
  };
}): Promise<any> => {
  return await request({
    url: `/order/orders?page=${page}&limit=10&primaryPhn=${primaryPhn}&fromDate=${date.from}&toDate=${date.to}`,
  });
};

export const getOrderById = async (bid: string): Promise<any> => {
  return await request({ url: `/order/orders/${bid}` });
};

export const getProducts = async (
  page: number,
  search: string,
): Promise<any> => {
  return await request({
    url: `/product/product?page=${page}&limit=10&sku=${search}`,
  });
};

export const searchProductBySku = async (sku: string): Promise<any> => {
  const response = await request({ url: `/product/product?sku=${sku}` });
  return response.data;
};

export const getProductById = async (id: string): Promise<any> => {
  return await request({ url: `/product/product/${id}` });
};

export const createProduct = async (bodyData: {
  name: string;
  description: string;
  perUnitCost: string | number;
  colour?: string[] | undefined;
  sku: string;
  size?: string[] | undefined;
  gender?: string | undefined;
  stock: number | string;
  thresholdStock: number | string;
  measurementType: string;
}): Promise<any> => {
  const response = await request({
    url: "/product/product",
    method: "POST",
    data: bodyData,
  });
  return response.data;
};

export const createProductFromCSV = async (
  bodyData: CSVProps,
): Promise<any> => {
  const formData = new FormData();
  formData.append("measurementType", bodyData?.measurementType);
  formData.append("csv", bodyData?.csvFile);
  try {
    const response = await request({
      url: `/product/product-from-csv`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("Error updating Csv File:", error);
    throw error;
  }
};

export const updateProduct = async (bodyData: updateProduct): Promise<any> => {
  const response = await request({
    url: `/product/product/${bodyData._id}`,
    method: "PUT",
    data: bodyData,
  });
  return response.data;
};

export const deleteProduct = async (bid: string): Promise<any> => {
  const response = await request({
    url: `/product/product/${bid}`,
    method: "DELETE",
  });
  return response.data;
};

export const getArchivedProducts = async (
  page: number,
  search: string,
  status: string = "archived",
): Promise<any> => {
  const isDeleted = status === "archived";
  const url = `/product/product?page=${page}&limit=10&sku=${search}&isDeleted=${isDeleted}`;
  return await request({ url });
};

// Archived a deleted product
export const archivedProduct = async (id: string): Promise<any> => {
  const response = await request({
    url: `/product/restore-product/${id}`,
    method: "PUT",
  });
  return response.data;
};

//Auth
export const signIn = async (
  credentials: SignInCredentials,
): Promise<SignInResponse> => {
  const response = await request<Response<SignInResponse>>({
    url: "/auth/login",
    method: "POST",
    data: credentials,
  });
  return response.data;
};

//done
export const changePassword = async (bdata: {
  oldPassword: string;
  newPassword: string;
}) =>
  await request({
    url: `/auth/change-password`,
    method: "POST",
    data: bdata,
  });

export const getOrganizationInfo = async (): Promise<any> => {
  return await request({ url: `/organization/organization` });
};

export const updateOrganization = async (
  bodyData: OrganizationInfo,
): Promise<any> => {
  if (!bodyData || !bodyData.id) {
    throw new Error("Organization ID is missing or undefined");
  }

  const { id, logo, ...otherValues } = bodyData;

  const formData = new FormData();
  for (const [key, value] of Object.entries(otherValues)) {
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, value as any);
    }
  }

  if (logo instanceof File) {
    formData.append("image", logo);
  }

  try {
    const response = await request({
      url: `/organization/organization/${id}`,
      method: "PUT",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw error;
  }
};

export const getNotifications = async (page: number): Promise<any> => {
  return await request({
    url: `/notification/notifications?page=${page}&limit=5`,
  });
};
