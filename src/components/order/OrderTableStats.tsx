import type { Table } from "@tanstack/react-table";
import { Activity, DollarSign, ShoppingCart, Truck } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface DataTableStatsProps<TData> {
  table: Table<TData>;
}

const DataTableStats = <TData,>({ table }: DataTableStatsProps<TData>) => {
  "use no memo";

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
    { totalAmount: 0, pendingCount: 0, processingCount: 0, shippingCount: 0 }
  );

  // 3. 格式化金額
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(stats.totalAmount);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">NT$ {formattedAmount}</div>
          <p className="text-xs text-muted-foreground">
            From {rows.length} orders
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <Activity className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingCount}</div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processing</CardTitle>
          <ShoppingCart className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.processingCount}</div>
          <p className="text-xs text-muted-foreground">Being prepared</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          <Truck className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.shippingCount}</div>
          <p className="text-xs text-muted-foreground">On the way</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTableStats;
