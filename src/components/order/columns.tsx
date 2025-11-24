import { DELIVERY_STATUSES, type Order } from "@/lib/definitions";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import DataTableColumnHeader from "../ui/data-table-column-header";
import { toast } from "sonner";
import { updateOrderDeliveryStatus } from "@/services/orderService";
import { StatusBadge } from "../ui/StatusBadge";
import {
  CheckCircle2,
  Clock,
  LoaderCircle,
  Undo2,
  XCircle,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const orderStatusMap: Record<string, string> = {
  pending: "bg-[#FCD34D]",
  processing: "bg-[#60A5FA]",
  completed: "bg-[#4ADE80]",
  cancelled: "bg-[#F87171]",
};
const orderStatusIconMap = {
  pending: Clock,
  processing: LoaderCircle,
  completed: CheckCircle2,
  cancelled: XCircle,
};

const paymentStatusIconMap = {
  pending: Clock,
  paid: CheckCircle2,
  refunded: Undo2,
};
const paymentStatusIconColorMap: Record<string, string> = {
  pending: "text-[#FB923C]",
  paid: "text-[#4ADE80]",
  refunded: "text-[#9CA3AF]",
};

const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user",
    header: () => <div className="w-[55px]">User</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Amount" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);

      return (
        <div className="max-w-[200px] font-medium">NT$ {formattedAmount}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <StatusBadge
          className="capitalize"
          status={status}
          statusMap={orderStatusMap}
          iconMap={orderStatusIconMap}
        />
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      return (
        <StatusBadge
          className="capitalize"
          status={status}
          iconMap={paymentStatusIconMap}
          iconColorMap={paymentStatusIconColorMap}
        />
      );
    },
  },
  {
    accessorKey: "deliveryStatus",
    header: "Delivery Status",
    cell: ({ row, table, column: { id } }) => {
      const { id: orderId, deliveryStatus } = row.original;

      const handleStatusChange = async (newStatus: string) => {
        const promise = () =>
          new Promise<Order>((resolve, reject) =>
            updateOrderDeliveryStatus(orderId, newStatus)
              .then(resolve)
              .catch(reject)
          );

        toast.promise(promise, {
          loading: "Updating status...",
          success: (updatedOrder) => {
            table.options.meta?.updateOrderInState(
              row.index,
              id,
              updatedOrder.deliveryStatus
            );
            return `Order status updated to ${updatedOrder.deliveryStatus}`;
          },
          error: (err) => {
            return err.message;
          },
        });
      };

      return (
        <Select
          value={deliveryStatus}
          onValueChange={(value) => handleStatusChange(value)}
        >
          <SelectTrigger className="capitalize bg-neutral-100 max-h-8 w-[115px] text-secondary-foreground rounded-l-md hover:bg-neutral-150 transition-all cursor-pointer border-none shadow-none focus-visible:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              {DELIVERY_STATUSES.map((status) => (
                <SelectItem
                  key={row.id + status}
                  value={status}
                  className="capitalize"
                >
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Date" />;
    },
  },
];

export default columns;
