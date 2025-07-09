import { Button } from "@/components/ui/Button";
import BreadcrumbWrapper from "@/components/ui/Breadcrumb";
import Icons from "@/assets/icons";
import useImportSuccessProduct from "./hooks/useImportSuccessProduct";

const ImportSuccessProduct = () => {
  const { importSuccessBreadcrumb, handleViewProducts, imported, skipped, errorProducts } =
    useImportSuccessProduct();

  const hasErrors = errorProducts && errorProducts.length > 0;
  return (
    <div className="flex flex-col gap-4">
      <BreadcrumbWrapper routes={importSuccessBreadcrumb} />

      <div className="flex flex-col items-center justify-center pt-4">
        <div className="flex w-[627px] flex-col rounded-lg bg-white p-4 shadow-sm">
          <div className="flex h-24 flex-col items-center text-center">
            <div className="mb-3 mt-4 flex items-center justify-center">
              <Icons.importSuccess />
            </div>
          </div>

          <div className="flex flex-row items-center justify-center gap-1 text-center text-sm font-normal text-[#000000]">
            Import completed! <span className="text-sm font-semibold">{imported}</span> products
            imported. <span className="text-sm font-semibold">{skipped}</span> products were
            skipped.
          </div>

          <span className="flex cursor-pointer items-center justify-center text-sm font-normal text-[#000000]">
            View import log
          </span>

          {hasErrors && (
            <div className="mt-[18px]">
              <div className="grid grid-cols-2 gap-16 px-6">
                <span className="text-sm font-semibold text-[#000000]">Products</span>
                <span className="text-sm font-semibold text-[#000000]">Reason</span>
              </div>

              <div className="overflow-y-auto">
                {errorProducts && errorProducts.length > 0 ? (
                  errorProducts.map((error: any, index: number) => (
                    <div key={`error-${index}`} className="grid grid-cols-2 gap-10 py-1 pl-6">
                      <span className="rounded-sm bg-[#EEEEEE] px-[6.5px] py-1 text-sm font-normal text-[#4D4D4D]">
                        {error.sku ||
                          error.productSku ||
                          error.row?.sku ||
                          `Row ${error.rowIndex || index + 1}`}
                      </span>
                      <span className="p-1 text-sm font-normal text-[#4D4D4D]">
                        {error.message || error.error || "Import failed"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-4 text-center text-sm text-gray-500">
                    No failed products to show.
                  </div>
                )}
              </div>
            </div>
          )}
          {!hasErrors && (
            <div className="px-4 py-4 text-center text-sm text-[#4D4D4D]">
              All products have been successfully imported.
            </div>
          )}

          <div className="mb-1 mt-3 flex justify-end gap-2 border-t pt-[18px]">
            <Button
              type="button"
              id="viewProducts"
              onClick={handleViewProducts}
              className="w-[128px] bg-black text-white hover:bg-black"
            >
              View Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportSuccessProduct;
