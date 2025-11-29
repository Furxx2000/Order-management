import { type Order } from "@/lib/definitions";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import DataTableSortHeader from "@/components/ui/data-table-sort-header";
import { StatusBadge } from "@/components/ui/StatusBadge";

import {
  orderStatusMap,
  orderStatusIconMap,
  paymentStatusIconMap,
  paymentStatusIconColorMap,
} from "../shared/constants";
import { AmountCell } from "../shared/AmountCell";
import { DeliveryStatusCell } from "../shared/DeliveryStatusCell";

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
    header: () => <div className="w-[95px]">ID</div>,
  },
  {
    accessorKey: "user",
    header: () => <div className="w-[55px]">User</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableSortHeader
        title="Amount"
        sortDirection={column.getIsSorted()}
        onSort={(direction) => {
          if (direction === "asc") column.toggleSorting(false);
          else if (direction === "desc") column.toggleSorting(true);
          else column.clearSorting();
        }}
      />
    ),
    cell: ({ row }) => (
      <AmountCell amount={parseFloat(row.getValue("amount"))} />
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="w-[95px]">Status</div>,
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
      <DataTableSortHeader
        title="Date"
        sortDirection={column.getIsSorted()}
        onSort={(direction) => {
          if (direction === "asc") column.toggleSorting(false);
          else if (direction === "desc") column.toggleSorting(true);
          else column.clearSorting();
        }}
      />
    ),
  },
];

export default columns;
