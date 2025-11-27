import { useState } from "react";
import { toast } from "sonner";
import { updateOrderDeliveryStatus } from "@/services/orderService";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DELIVERY_STATUSES } from "@/lib/definitions";
import type { Order } from "@/lib/definitions";

interface DeliveryStatusCellProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdate: (newStatus: string) => void;
}

export const DeliveryStatusCell = ({
  orderId,
  currentStatus,
  onStatusUpdate,
}: DeliveryStatusCellProps) => {
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = async (newStatus: string) => {
    // Optimistic update
    setStatus(newStatus);

    const promise = () =>
      new Promise<Order>((resolve, reject) =>
        updateOrderDeliveryStatus(orderId, newStatus)
          .then((updatedOrder) => {
            onStatusUpdate(updatedOrder.deliveryStatus);
            resolve(updatedOrder);
          })
          .catch((err) => {
            // Revert on failure
            setStatus(currentStatus);
            reject(err);
          })
      );

    toast.promise(promise, {
      loading: "Updating status...",
      success: (updatedOrder) =>
        `Order status updated to ${updatedOrder.deliveryStatus}`,
      error: (err) => err.message,
    });
  };

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className="capitalize bg-neutral-100 max-h-8 w-[115px] text-secondary-foreground rounded-l-md hover:bg-neutral-150 transition-all cursor-pointer border-none shadow-none focus-visible:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start">
        <SelectGroup>
          {DELIVERY_STATUSES.map((status) => (
            <SelectItem key={status} value={status} className="capitalize">
              {status}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
