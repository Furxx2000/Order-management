import { type Order } from "@/lib/definitions";
import type { ColumnDef } from "@tanstack/react-table";
import DataTableSortHeader from "../ui/data-table-sort-header";
import { StatusBadge } from "../ui/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";

import {
  orderStatusMap,
  orderStatusIconMap,
  paymentStatusIconMap,
  paymentStatusIconColorMap,
} from "./constants";
import { AmountCell } from "./AmountCell";
import { DeliveryStatusCell } from "./DeliveryStatusCell";

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
    header: ({ column }) => (
      <DataTableSortHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <AmountCell amount={parseFloat(row.getValue("amount"))} />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <StatusBadge
          status={status}
          statusMap={orderStatusMap}
          iconMap={orderStatusIconMap}
        />
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      return (
        <StatusBadge
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
      return (
        <DeliveryStatusCell
          orderId={orderId}
          currentStatus={deliveryStatus}
          onStatusUpdate={(newStatus) =>
            table.options.meta?.updateOrderInState(row.index, id, newStatus)
          }
        />
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableSortHeader column={column} title="Date" />
    ),
  },
];

export default columns;
