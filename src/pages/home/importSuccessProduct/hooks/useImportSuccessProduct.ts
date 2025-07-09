import { useEffect } from "react";
import { importSuccessBreadcrumb } from "../constants";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";

const useImportSuccessProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const imported = location.state?.imported ?? null;
  const skipped = location.state?.skipped ?? null;
  const importedProducts = location.state?.importedProducts ?? [];
  const errorProducts = location.state?.errorProducts ?? [];

  useEffect(() => {
    if (imported === null || skipped === null) {
      navigate(ROUTES.IMPORT_PRODUCT);
    }
  }, [imported, skipped, navigate]);

  const handleViewProducts = () => {
    navigate(ROUTES.PRODUCTS);
  };

  return {
    importSuccessBreadcrumb,
    handleViewProducts,
    imported,
    skipped,
    importedProducts,
    errorProducts,
  };
};

export default useImportSuccessProduct;
