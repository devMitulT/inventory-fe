import EditProduct from "./components/EditProduct";
import { useEditProduct } from "./hooks/useEditProduct";

const EditProductBooking = () => {
  const { product } = useEditProduct();

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center p-2">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-gray-500"></div>
        </div>
        <span>Loading...</span>
      </div>
    );
  } else {
    return <EditProduct product={product} />;
  }
};

export default EditProductBooking;
