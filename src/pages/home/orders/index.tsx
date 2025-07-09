import { InputField } from "@/components/ui/Input";
import { useOrders } from "./hooks/useOrders";
import CustomTable from "@/components/ui/Table";
import { CalendarDays, Search } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { allowOnlyNumbers, cn, handleNumberPaste } from "@/lib/utils";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const Orders = () => {
  const {
    columns,
    orderDatas,
    orderLoadings,
    handlePageChange,
    handleDeleteOrder,
    date,
    handleFromDateChange,
    handleToDateChange,
    handleSearchChange,
    orderDelete,
    isBookingDeleting,
    handleOrder,
  } = useOrders();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between px-6 pb-2 pt-6">
        <h1 id="Orders" className="pb-3 font-semibold text-[#000000]">
          Orders
        </h1>
        <div className="flex flex-wrap gap-4">
          <div>
            <InputField
              id="mobileNo"
              maxLength={10}
              onChange={handleSearchChange}
              type="search"
              placeholder="Search by mobile no"
              className="w-[360px] bg-white pe-2 ps-9 font-medium"
              onKeyDown={allowOnlyNumbers}
              onPaste={handleNumberPaste}
            />
            <Search size={20} opacity={0.5} className="relative bottom-[26px] left-2" />
          </div>
          <div>
            <DatePicker
              month={new Date()}
              selectedValue={date?.from}
              onSelect={handleFromDateChange}
            >
              <Button
                id="fromDate"
                variant="outline"
                className={cn(
                  "mr-3 h-8 w-[186px] pl-3 text-left font-medium",

                  !date?.from && "text-muted-foreground"
                )}
              >
                {date?.from ? `From : ${format(date?.from, "dd/MM/yyyy")}` : <span>From date</span>}
                <CalendarDays className="ml-auto h-4 w-4 opacity-100" />
              </Button>
            </DatePicker>
            <DatePicker
              month={new Date()}
              selectedValue={date?.to}
              onSelect={handleToDateChange}
              disabled={(dat) => (date?.from ? dat < date.from : false)}
            >
              <Button
                id="toDate"
                variant="outline"
                className={cn(
                  "h-8 w-[186px] pl-3 text-left font-medium",

                  !date?.from && "text-muted-foreground"
                )}
                disabled={!date?.from}
              >
                {date?.to ? `To : ${format(date?.to, "dd/MM/yyyy")}` : <span>To date</span>}
                <CalendarDays className="ml-auto h-4 w-4 opacity-100" />
              </Button>
            </DatePicker>
          </div>
        </div>
      </div>

      <div className="mx-6 flex flex-col gap-4 [&_.table-row_td:nth-child(2)]:w-[200px] [&_.table-row_td:nth-child(3)]:w-[400px]">
        <CustomTable
          columns={columns}
          data={orderDatas?.data || []}
          isLoading={orderLoadings}
          pagination={{
            page: orderDatas?.pagination?.page || 1,
            totalPages: orderDatas?.pagination?.totalPages || 0,
            onPageChange: handlePageChange,
          }}
        />

        {/* Confirmation Modal */}
        {orderDelete && (
          <ConfirmationModal
            isOpen={Boolean(orderDelete)}
            title="Confirm Order Deletion?"
            message="Are you sure you want to delete this order?"
            subMessage="This action cannot be undone."
            confirmButtonText="Yes, Delete"
            onConfirm={handleDeleteOrder}
            onCancel={() => handleOrder("")}
            isLoading={isBookingDeleting}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
