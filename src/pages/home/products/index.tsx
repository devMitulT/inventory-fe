import { Link } from "react-router-dom";
import { Search } from "lucide-react";
// Components

import { Button } from "@/components/ui/Button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useProducts } from "./hooks/useProducts";
import CustomTable from "@/components/ui/Table";
import { InputField } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";
import { ROUTES } from "@/constants";
import Icons from "@/assets/icons";

const Products = () => {
  const {
    columns,
    archivedColumns,
    productLoading,
    productsData,
    productDelete,
    handleDeleteProduct,
    isDeletingProduct,
    handleProductDelete,
    handlePageChange,
    handleSearchChange,
    selectedStatus,
    handleStatusChange,
    productToArchived,
    setProductToArchived,
    handleProductArchived,
  } = useProducts();

  return (
    <div>
      <div className="flex items-center justify-between p-6">
        <h1 id="Products" className="font-semibold text-[#000000]">
          Products
        </h1>
        <div className="flex gap-4">
          {/* Status Filter */}
          <Select
            defaultValue={selectedStatus}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger
              id="Status"
              className="inline-flex h-8 w-[200px] items-center justify-between rounded-md border bg-white px-3 py-2 focus:ring-1 focus:ring-black"
            >
              <span className="font-medium">
                {selectedStatus === "available"
                  ? "Available"
                  : selectedStatus === "archived"
                    ? "Archived"
                    : ""}
              </span>
            </SelectTrigger>
            <SelectContent className="mt-1 w-[200px] rounded-md border border-gray-300 bg-white shadow-lg">
              <SelectItem
                value="available"
                className="cursor-pointer px-4 py-2 text-sm font-medium"
              >
                Available
              </SelectItem>
              <SelectItem
                value="archived"
                className="cursor-pointer px-4 py-2 text-sm font-medium"
              >
                Archived
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Search Field */}
          <div className="relative">
            <InputField
              id="sku"
              type="search"
              placeholder="Search by SKU"
              maxLength={40}
              className="w-[360px] bg-white pe-2 ps-9 font-medium"
              onChange={handleSearchChange}
            />
            <Search
              size={20}
              opacity={0.5}
              className="absolute bottom-[6px] left-2"
            />
          </div>

          <Link to={ROUTES.ADD_PRODUCT}>
            <Button
              id="addProduct"
              className="h-8 w-[128px] rounded-lg bg-black text-white hover:bg-black hover:text-white"
            >
              + Add Product
            </Button>
          </Link>

          <Link to={ROUTES.IMPORT_PRODUCT}>
            <Button
              id="importProduct"
              className="h-8 w-[128px] rounded-lg bg-white text-black hover:bg-white hover:text-black"
            >
              <Icons.importProduct /> Import
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-6 flex flex-col gap-4 [&_.table-head]:w-auto">
        {selectedStatus === "archived" ? (
          <CustomTable
            columns={archivedColumns(setProductToArchived)}
            data={productsData?.data || []}
            isLoading={productLoading}
            pagination={{
              page: productsData?.pagination?.page || 1,
              totalPages: productsData?.pagination?.totalPages || 0,
              onPageChange: handlePageChange,
            }}
          />
        ) : (
          <CustomTable
            columns={columns}
            data={productsData?.data || []}
            isLoading={productLoading}
            pagination={{
              page: productsData?.pagination?.page || 1,
              totalPages: productsData?.pagination?.totalPages || 0,
              onPageChange: handlePageChange,
            }}
          />
        )}
        {productDelete && selectedStatus !== "archived" && (
          <ConfirmationModal
            isOpen={Boolean(productDelete)}
            title="Confirm Product Deletion?"
            message="Are you sure you want to delete this product?"
            subMessage="This action cannot be undone."
            confirmButtonText="Yes, Delete"
            onConfirm={handleDeleteProduct}
            onCancel={() => handleProductDelete("")}
            isLoading={isDeletingProduct}
          />
        )}
        {productToArchived && selectedStatus === "archived" && (
          <ConfirmationModal
            isOpen={!!productToArchived}
            title="Are you sure you want to restore this product?"
            message="It will be moved back to your active product listings."
            confirmButtonText="Restore"
            onConfirm={() => {
              handleProductArchived(productToArchived);
              setProductToArchived(null);
            }}
            onCancel={() => setProductToArchived(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
