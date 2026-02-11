import { Button } from "@/components/ui/Button";
import { useReservedProducts } from "./hooks/useReservedProducts";
import CircularProgressLoader from "@/components/ui/Spinner";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { SmartPagination } from "@/components/CustomPagination";

function ReservedProducts() {
  const {
    handleNavigateToCreateBooking,
    isNotification,
    allNotifications,
    handlePageChange,
  } = useReservedProducts();
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
              className={`relative w-[900px] mx-10 mb-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group
  ${
    el.type === "warning" || el.type === "lowStock"
      ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300"
      : "bg-gradient-to-r from-red-50 to-red-100 border-red-300"
  }
  border`}
            >
              {/* Left Accent Bar */}
              <div
                className={`absolute left-0 top-0 h-full w-1.5
    ${
      el.type === "warning" || el.type === "lowStock"
        ? "bg-yellow-500"
        : "bg-red-500"
    }`}
              />

              <CardContent className="p-4 flex items-center justify-between gap-3">
                {/* Left Section */}
                <div className="flex gap-3 items-center">
                  <div
                    className={`p-2 rounded-full shadow-sm
        ${
          el.type === "warning" || el.type === "lowStock"
            ? "bg-yellow-200 text-yellow-800"
            : "bg-red-200 text-red-800"
        }`}
                  >
                    {el.type === "warning" || el.type === "lowStock" ? (
                      <AlertTriangle size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                  </div>

                  <div className="leading-tight">
                    <h3 className="font-semibold text-base text-gray-800">
                      {el.product.name}
                    </h3>

                    <p className="text-xs text-gray-600">
                      SKU: <span className="font-medium">{el.product.sku}</span>
                    </p>

                    <p className="text-sm text-gray-700">
                      Only{" "}
                      <span
                        className={`font-bold
            ${
              el.type === "warning" || el.type === "lowStock"
                ? "text-yellow-700"
                : "text-red-700"
            }`}
                      >
                        {el.stockAtOrder}
                      </span>{" "}
                      units left
                    </p>
                  </div>
                </div>

                {/* Right Section */}
                <div className="text-right leading-tight">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
        ${
          el.type === "warning" || el.type === "lowStock"
            ? "bg-yellow-200 text-yellow-800"
            : "bg-red-200 text-red-800"
        }`}
                  >
                    {el.type === "warning" || el.type === "lowStock"
                      ? "Low Stock"
                      : "Critical"}
                  </span>

                  <p className="text-[11px] text-gray-500 mt-1">
                    {new Date(el.createdAt).toLocaleString()}
                  </p>

                  <p className="text-[11px] text-gray-500">
                    Remaining units: {el.product.stock}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        <SmartPagination
          page={allNotifications?.pagination?.page}
          totalPages={allNotifications?.pagination?.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}

export default ReservedProducts;
