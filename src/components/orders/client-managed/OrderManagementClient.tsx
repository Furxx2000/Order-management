import columns from "./columns";
import DataTable from "@/components/ui/data-table";
import OrderTableSkeleton from "./OrderTableSkeleton";
import { useOrders } from "@/hooks/useOrders";
import { useDataTable } from "@/hooks/useDataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderTableToolbar } from "./OrdersToolbar";
import OrderTableStats from "../shared/OrderTableStats";

const OrderManagementClient = () => {
  "use no memo";

  const { orders, isLoading } = useOrders();
  const table = useDataTable({ data: orders, columns });

  if (isLoading) {
    return <OrderTableSkeleton />;
  }

  const rows = table.getFilteredRowModel().rows;
  const stats = rows.reduce(
    (acc, row) => {
      const amount = Number(row.getValue("amount")) || 0;
      acc.totalAmount += amount;

      const status = row.getValue("status") as string;
      if (status === "pending") acc.pendingCount++;
      if (status === "processing") acc.processingCount++;

      const deliveryStatus = row.getValue("deliveryStatus") as string;
      if (deliveryStatus === "shipping") acc.shippingCount++;

      return acc;
    },
    {
      totalAmount: 0,
      pendingCount: 0,
      processingCount: 0,
      shippingCount: 0,
    }
  );

  return (
    <Card className="py-8 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
        <CardDescription>
          Here's a list of the orders every month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrderTableStats stats={{ ...stats, totalOrders: rows.length }} />
        <OrderTableToolbar table={table} />
        <DataTable table={table} />
      </CardContent>
    </Card>
  );
};

export default OrderManagementClient;
