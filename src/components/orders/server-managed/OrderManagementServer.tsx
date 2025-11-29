import { X } from "lucide-react";
import ServerTableSkeleton from "./OrdersTableSkeleton";
import { statuses, deliveryStatuses } from "../shared/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import DataTableFacetedFilter from "@/components/ui/data-table-faceted-filter";
import { Input } from "@/components/ui/input";
import OrderTable from "./OrderTable";
import OrderTableStats from "../shared/OrderTableStats";
import { OrderProvider } from "@/context/OrderContext";
import { useOrderContext } from "@/context/useOrderContext";

const OrderTableServerSideContent = () => {
  const {
    search,
    filters,
    isFiltered,
    stats,
    totalCount,
    isLoading,
    pageSize,
    dispatch,
  } = useOrderContext();

  const handleReset = () => {
    dispatch({ type: "RESET_FILTERS" });
    dispatch({ type: "SET_SEARCH", payload: "" });
  };

  const statsData = {
    totalAmount: stats.totalAmount,
    totalOrders: totalCount,
    pendingCount: stats.pendingCount,
    processingCount: stats.processingCount,
    shippingCount: stats.shippingCount,
  };

  return (
    <Card className="py-8 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
        <CardDescription>
          Here's a list of the orders every month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrderTableStats stats={statsData} />
        <div className="flex items-center flex-wrap py-4 gap-y-4 gap-2">
          <Input
            placeholder="Filter user or user id..."
            value={search}
            onChange={(event) =>
              dispatch({ type: "SET_SEARCH", payload: event.target.value })
            }
            className="max-w-2xs h-8"
          />
          <DataTableFacetedFilter
            title="Status"
            options={statuses}
            selectedValues={filters["status"] || []}
            onFilterChange={(values) =>
              dispatch({
                type: "SET_FILTER",
                payload: { key: "status", value: values },
              })
            }
          />
          <DataTableFacetedFilter
            title="Delivery Status"
            options={deliveryStatuses}
            selectedValues={filters["deliveryStatus"] || []}
            onFilterChange={(values) =>
              dispatch({
                type: "SET_FILTER",
                payload: { key: "deliveryStatus", value: values },
              })
            }
          />

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => handleReset()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        {isLoading ? (
          <ServerTableSkeleton rowCount={pageSize} />
        ) : (
          <OrderTable />
        )}
      </CardContent>
    </Card>
  );
};

const OrderManagementServer = () => {
  return (
    <OrderProvider>
      <OrderTableServerSideContent />
    </OrderProvider>
  );
};

export default OrderManagementServer;
