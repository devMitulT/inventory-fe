import { useEditProductDetails } from "../hooks/useEditProduct";
import { breadCrumbData, EditProductProps } from "../constants";
import BreadcrumbWrapper from "@/components/ui/Breadcrumb";
import { ProductForm } from "@/components/product-form";

const EditProduct = ({ product }: EditProductProps) => {
  const {
    form,
    onSubmit,
    isUpdatingProduct,
    handleCancel,
    watchDescription,
  } = useEditProductDetails({ product });

  return (
    <div>
      <BreadcrumbWrapper routes={breadCrumbData} />
      <ProductForm
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isUpdatingProduct}
        handleProductCancel={handleCancel}
        watchDescription={watchDescription}
        isEditMode={true}
      />
    </div>
  );
};

export default EditProduct;
