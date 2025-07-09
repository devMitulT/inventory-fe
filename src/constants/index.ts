// Query keys
export const KEYS = {
  GET_ALL_PRODUCTS: "GET_ALL_PRODUCTS",
  GET_PRODUCTS: "GET_PRODUCTS",
  GET_BOOKINGS_FOR_PRODUCT: "GET_BOOKINGS_FOR_PRODUCT",
  GET_TOMORROW_PRODUCTS: "GET_TOMORROW_PRODUCTS",
  GET_ORDERS: "GET_ORDERS",
  GET_ORGANIZATION_INFO: "GET_ORGANIZATION_INFO",
  GET_PRODUCTS_SKU: " GET_PRODUCTS_SKU",
  GET_BOOKING_ID: " GET_BOOKING_ID",
  GET_ARCHIVED_PRODUCTS: "getArchivedProducts",
  GET_ALL_NOTIFICATION: "GET_ALL_NOTIFICATION",
};

// routes
export const ROUTES = {
  SIGN_IN: "/sign-in",

  // Home route
  HOME: "/home",

  // Product routes
  PRODUCTS: "/products",
  ADD_PRODUCT: "/add-product",
  IMPORT_PRODUCT: "/import-product",
  IMPORT_SUCCESS_PRODUCT: "/import-success",
  PRODUCT_DETAILS: "/product/:id",
  EDIT_PRODUCT: "/edit-product/:id",

  // booking routes
  CREATE_BOOKING: "/create-booking",
  EDIT_BOOKING: "/edit-booking",

  // order routes
  ORDERS: "/orders",
  EDIT_ORDER: "/edit-order/:id",
  VIEW_ORDER: "/view-order/:id",
  RETURN: "/return",
  DELIVERY: "/delivery",

  // profile
  PROFILE: "/profile",

  // change password
  CHANGE_PASSWORD: "/change-password",

  // e-recipt
  E_RECEIPT: "/e-receipt/:bookingId",
};
