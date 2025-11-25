import { useEffect, useState } from "react";
import type { Order } from "@/lib/definitions";
import { fetchOrders } from "@/services/orderService";
import { toast } from "sonner";
import columns from "./columns";
import DataTable from "../ui/data-table";
import OrderTableSkeleton from "../OrderTableSkeleton";

const OrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred while fetching orders.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (isLoading) {
    return <OrderTableSkeleton />;
  }

  return (
    <div className="w-full mx-auto">
      <DataTable columns={columns} tableData={orders} />
    </div>
  );
};

export default OrderTable;
