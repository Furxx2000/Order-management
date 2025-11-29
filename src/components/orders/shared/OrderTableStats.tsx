import { Activity, DollarSign, ShoppingCart, Truck } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface OrderTableStatsProps {
  stats: {
    totalAmount: number;
    totalOrders: number;
    pendingCount: number;
    processingCount: number;
    shippingCount: number;
  };
}

const OrderTableStats = ({ stats }: OrderTableStatsProps) => {
  const {
    totalAmount,
    totalOrders,
    pendingCount,
    processingCount,
    shippingCount,
  } = stats;

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalAmount);

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
            From {totalOrders} orders
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <Activity className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processing</CardTitle>
          <ShoppingCart className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{processingCount}</div>
          <p className="text-xs text-muted-foreground">Being prepared</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          <Truck className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{shippingCount}</div>
          <p className="text-xs text-muted-foreground">On the way</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTableStats;
