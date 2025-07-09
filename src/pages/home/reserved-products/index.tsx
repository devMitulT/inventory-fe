import { Button } from "@/components/ui/Button";
import { useReservedProducts } from "./hooks/useReservedProducts";
import CircularProgressLoader from "@/components/ui/Spinner";
import { Card, CardContent } from "@/components/ui/card";

function ReservedProducts() {
  const { handleNavigateToCreateBooking, isNotification, allNotifications } =
    useReservedProducts();

  return (
    <>
      <div className="flex flex-row items-center justify-between p-6">
        <span id="Home" className="text-md flex font-semibold text-[#000000]">
          Notification
        </span>
        <div className="flex flex-row gap-4 font-medium text-[#000000]">
          <div className="flex">
            <Button
              id="createBooking"
              onClick={handleNavigateToCreateBooking}
              className="bg-black text-white hover:bg-black hover:text-white"
            >
              + Book Order
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col  justify-center items-center h-[full]">
        {isNotification && <CircularProgressLoader size={40} color="black" />}

        {!isNotification &&
          allNotifications?.data?.map((el: any) => (
            <Card
              key={el._id}
              className={`border-gray-[#FFFFFF] w-[900px] mx-10 mb-5 overflow-clip p-1 rounded-2xl border ${
                el.type === "warning" || el.type === "lowStock"
                  ? "bg-yellow-100"
                  : "bg-red-100"
              }`}
            >
              <CardContent>
                {el.product.sku} : {el.product.name} has {el.product.stock} unit
                left
                <p>{new Date(el.createdAt).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );
}

export default ReservedProducts;
