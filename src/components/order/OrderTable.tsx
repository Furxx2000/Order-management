import columns from "./columns";
import DataTable from "../ui/data-table";
import OrderTableSkeleton from "../OrderTableSkeleton";
import { useOrders } from "@/hooks/useOrders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import OrderTableStats from "./OrderTableStats";
import { Input } from "../ui/input";
import DataTableFacetedFilter from "../ui/data-table-faceted-filter";
import { statuses, deliveryStatuses } from "./constants";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const OrderTable = () => {
  const { orders, isLoading } = useOrders();

  if (isLoading) {
    return <OrderTableSkeleton />;
  }

  return (
    <Card className="py-8 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
        <CardDescription>
          Here's a list of the orders every month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          tableData={orders}
          renderToolbar={(table) => {
            const isFiltered = table.getState().columnFilters.length > 0;
            return (
              <>
                <OrderTableStats table={table} />
                <div className="flex items-center flex-wrap py-4 gap-y-4 gap-2">
                  <Input
                    placeholder="Filter user or user id..."
                    value={(table.getState().globalFilter as string) ?? ""}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className="max-w-2xs h-8"
                  />
                  {table.getColumn("status") && (
                    <DataTableFacetedFilter
                      column={table.getColumn("status")}
                      title="Status"
                      options={statuses}
                    />
                  )}
                  {table.getColumn("deliveryStatus") && (
                    <DataTableFacetedFilter
                      column={table.getColumn("deliveryStatus")}
                      title="Delivery Status"
                      options={deliveryStatuses}
                    />
                  )}
                  {isFiltered && (
                    <Button
                      variant="ghost"
                      onClick={() => table.resetColumnFilters()}
                      className="h-8 px-2 lg:px-3"
                    >
                      Reset
                      <X className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </>
            );
          }}
        />
      </CardContent>
    </Card>
  );
};

export default OrderTable;
