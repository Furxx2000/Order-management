import { useState, useEffect } from "react";
import { fetchOrders } from "@/services/orderService";
import type { Order } from "@/lib/definitions";
import { toast } from "sonner";

export const useOrders = () => {
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

  return { orders, isLoading, setOrders };
};
