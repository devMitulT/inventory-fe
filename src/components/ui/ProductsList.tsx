import { useGetAllProducts, useGetAllTomorrowProducts } from "@/services/queries";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const dd = String(tomorrow.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

const types: { [key: number]: string } = {
  1: "Departures",
  2: "Arrivals",
};

interface Customer {
  customerName: string;
  phoneNumberPrimary: string;
  phoneNumberSecondary: string;
}

interface Product {
  _id: string;
  advancePayment: number;
  customer: Customer;
  endDate: string;
  isDeleted: boolean;
  notes: string;
  productId: number[];
  rentelReason: string;
  startDate: string;
}

interface ratings {
  rate: number;
  count: number;
}

interface Pr {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: ratings;
  title: string;
}
const ProductsList = ({ type }: { type: number }) => {
  const tomorrowDate = getTomorrowDate();

  const { data, isLoading: isLoading2 } = useGetAllTomorrowProducts({
    type,
    fromDate: tomorrowDate,
    toDate: tomorrowDate,
  });
  const { data: productsData, isLoading } = useGetAllProducts();

  if (isLoading || isLoading2) {
    return (
      <div>
        <h1>
          <Skeleton className="h-[40px] w-[400px] bg-slate-300" />
        </h1>
        <div className="flex flex-col items-center justify-center">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="my-3 h-[200px] w-full bg-slate-300" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">{types[type]} For Tommorow</h1>
      <div className="flex flex-col items-center justify-center">
        {data?.map((product: Product, index: number) => {
          const productDetails = productsData.filter((pr: Pr) => product.productId.includes(pr.id));

          const totalPrice = productDetails.reduce(
            (sum: number, productDetail: Pr) => sum + (productDetail.price || 0),
            0
          );

          return (
            <Card className="m-4 grid w-full grid-cols-2 p-4" key={index}>
              <CardTitle className="col-span-2">
                <h1 className="px-6 pb-3 text-lg font-semibold">Product Details</h1>
              </CardTitle>
              <CardContent className="col-span-2 p-0 pt-2">
                {productDetails.map((productDetail: Pr, index: number) => (
                  <div key={productDetail.id} className="mb-3 flex justify-between border-b p-2">
                    <h2 className="text-md font-medium">
                      {index + 1}. {productDetail.title} ({productDetail.id})
                    </h2>

                    <p>Price: ₹{productDetail?.price || "N/A"}</p>
                  </div>
                ))}
              </CardContent>
              <CardContent>
                <h2 className="flex">
                  <p className="mr-1 font-semibold">Advance Payment : </p> ₹{product.advancePayment}
                </h2>
              </CardContent>

              <CardContent>
                <h2 className="flex">
                  <p className="mr-1 font-semibold">Total Price : </p> ₹{totalPrice}
                </h2>
              </CardContent>

              <CardContent>
                <h2 className="flex">
                  <p className="mr-1 font-semibold">Customer Name : </p>
                  {product.customer.customerName}
                </h2>
              </CardContent>

              <CardContent>
                <h2 className="flex">
                  <p className="mr-1 font-semibold">Phone Number : </p>
                  {product.customer.phoneNumberPrimary}
                </h2>
              </CardContent>
              <CardContent className="col-span-2">
                <h2 className="flex">
                  <p className="mr-1 font-semibold">Alternate Phone Number : </p>
                  {product.customer.phoneNumberSecondary || "-"}
                </h2>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsList;
