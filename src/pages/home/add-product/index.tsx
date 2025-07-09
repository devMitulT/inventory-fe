import { useProduct } from "./hooks/useProduct";
import BreadcrumbWrapper from "@/components/ui/Breadcrumb";
import { ProductForm } from "@/components/product-form";

const AddProduct = () => {
  const {
    form,
    handleCreateProduct,
    handleProductCancel,
    breadCrumbData,
    watchDescription,
    productCreating,
  } = useProduct();

  return (
    <div>
      <BreadcrumbWrapper routes={breadCrumbData} />
      <ProductForm
        form={form}
        onSubmit={handleCreateProduct}
        isSubmitting={productCreating}
        handleProductCancel={handleProductCancel}
        watchDescription={watchDescription}
        isEditMode={false}
      />
    </div>
  );
};

export default AddProduct;
