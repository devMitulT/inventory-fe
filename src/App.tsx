import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./constants";

// Layout
import AuthLayout from "./layouts/AuthLayout";

// Pages
import Signin from "./pages/auth/sign-in";
import Products from "./pages/home/products";
import AddProduct from "./pages/home/add-product";
import ViewProductDetails from "./pages/home/view-product-details";
import CreateBookingPage from "./pages/home/create-booking";
import ReservedProducts from "./pages/home/reserved-products";
import ChangePassword from "./pages/auth/change-password";
import Profile from "./pages/auth/profile";
import Orders from "./pages/home/orders";
import EditOrder from "./pages/home/edit-order";
import ViewOrder from "./pages/home/view-order";
import EditProductBooking from "./pages/home/edit-product";
import NotFound from "./pages/notFound";
import InvoiceDownload from "./pages/home/view-order/invoiceDownload";
import ImportSuccessProduct from "./pages/home/importSuccessProduct";
import ImportProduct from "./pages/home/import-product";

function App() {
  return (
    <div id="main" className="">
      <Routes>
        <Route path={ROUTES.SIGN_IN} element={<Signin />} />
        <Route path={ROUTES.E_RECEIPT} element={<InvoiceDownload />} />

        <Route element={<AuthLayout />}>
          <Route index element={<ReservedProducts />} />

          {/* Home route  */}
          <Route path={ROUTES.HOME} element={<ReservedProducts />} />

          {/* Product routes  */}
          <Route path={ROUTES.PRODUCTS} element={<Products />} />
          <Route path={ROUTES.ADD_PRODUCT} element={<AddProduct />} />
          <Route path={ROUTES.EDIT_PRODUCT} element={<EditProductBooking />} />
          <Route
            path={ROUTES.PRODUCT_DETAILS}
            element={<ViewProductDetails />}
          />
          <Route path={ROUTES.IMPORT_PRODUCT} element={<ImportProduct />} />
          <Route
            path={ROUTES.IMPORT_SUCCESS_PRODUCT}
            element={<ImportSuccessProduct />}
          />

          {/* Booking routes  */}
          <Route path={ROUTES.CREATE_BOOKING} element={<CreateBookingPage />} />
          <Route path={ROUTES.EDIT_BOOKING} element={<CreateBookingPage />} />

          {/* Order routes  */}
          <Route path={ROUTES.ORDERS} element={<Orders />} />
          <Route path={ROUTES.EDIT_ORDER} element={<EditOrder />} />
          <Route path={ROUTES.VIEW_ORDER} element={<ViewOrder />} />

          {/* Profile */}
          <Route path={ROUTES.PROFILE} element={<Profile />} />

          {/* Change Password */}
          <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePassword />} />
        </Route>
        {/*Not found page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
