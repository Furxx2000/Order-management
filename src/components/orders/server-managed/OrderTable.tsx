import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import type { Order } from "@/lib/definitions";
import { Checkbox } from "@/components/ui/checkbox";
import DataTablePagination from "@/components/ui/data-table-pagination";
import DataTableSortHeader from "@/components/ui/data-table-sort-header";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  orderStatusMap,
  orderStatusIconMap,
  paymentStatusIconMap,
  paymentStatusIconColorMap,
} from "../shared/constants";

import { DeliveryStatusCell } from "../shared/DeliveryStatusCell";
import { AmountCell } from "../shared/AmountCell";
import { useOrderContext } from "@/context/useOrderContext";

const OrderTable = () => {
  const {
    orders,
    page,
    pageSize,
    totalCount,
    pageCount,
    sorting,
    rowSelection,
    dispatch,
  } = useOrderContext();

  const pagination = {
    pageIndex: page,
    pageSize,
    totalCount,
    pageCount,
  };

  const getSortDirection = (columnId: string) => {
    if (sorting?.id === columnId) {
      return sorting.direction;
    }
    return false;
  };

  const onSortChange = (id: string, direction: "asc" | "desc" | false) => {
    dispatch({
      type: "SET_SORTING",
      payload: direction ? { id, direction } : null,
    });
  };

  const isAllPageRowsSelected =
    orders.length > 0 && orders.every((order) => rowSelection[order.id]);
  const isSomePageRowsSelected = orders.some((order) => rowSelection[order.id]);

  const selectedRowsCount = Object.values(rowSelection).filter(Boolean).length;

  return (
    <>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5" colSpan={1}>
                <Checkbox
                  checked={
                    isAllPageRowsSelected ||
                    (isSomePageRowsSelected && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                    dispatch({
                      type: "TOGGLE_ALL_ROWS",
                      payload: value as boolean,
                    })
                  }
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="pl-5">
                <div className="w-[95px]">ID</div>
              </TableHead>
              <TableHead className="pl-5">
                <div className="w-[55px]">User</div>
              </TableHead>
              <TableHead className="pl-5">
                <DataTableSortHeader
                  title="Amount"
                  sortDirection={getSortDirection("amount")}
                  onSort={(direction) => onSortChange("amount", direction)}
                />
              </TableHead>
              <TableHead className="pl-5">
                <div className="w-[95px]">Status</div>
              </TableHead>
              <TableHead className="pl-5">Payment</TableHead>
              <TableHead className="pl-5">Delivery Status</TableHead>
              <TableHead className="pl-5">
                <DataTableSortHeader
                  title="Date"
                  sortDirection={getSortDirection("date")}
                  onSort={(direction) => onSortChange("date", direction)}
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  data-state={rowSelection[order.id] && "selected"}
                >
                  <TableCell className="pl-5">
                    <Checkbox
                      checked={rowSelection[order.id] || false}
                      onCheckedChange={(value) =>
                        dispatch({
                          type: "TOGGLE_ROW",
                          payload: {
                            orderId: order.id,
                            value: value as boolean,
                          },
                        })
                      }
                      aria-label="Select row"
                    />
                  </TableCell>
                  <TableCell className="font-medium pl-5">{order.id}</TableCell>
                  <TableCell className="pl-5">{order.user}</TableCell>
                  <TableCell className="pl-5">
                    <AmountCell amount={order.amount} />
                  </TableCell>
                  <TableCell className="pl-5">
                    <StatusBadge
                      status={order.status}
                      statusMap={orderStatusMap}
                      iconMap={orderStatusIconMap}
                    />
                  </TableCell>
                  <TableCell className="pl-5">
                    <StatusBadge
                      status={order.paymentStatus}
                      iconMap={paymentStatusIconMap}
                      iconColorMap={paymentStatusIconColorMap}
                    />
                  </TableCell>
                  <TableCell className="pl-5">
                    <DeliveryStatusCell
                      currentStatus={order.deliveryStatus}
                      orderId={order.id}
                      onStatusUpdate={(newStatus) =>
                        dispatch({
                          type: "UPDATE_ORDER",
                          payload: {
                            orderId: order.id,
                            updates: {
                              deliveryStatus:
                                newStatus as Order["deliveryStatus"],
                            },
                          },
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="pl-5">{order.date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination
          pageIndex={pagination.pageIndex - 1}
          pageSize={pagination.pageSize}
          pageCount={pagination.pageCount}
          selectedRows={selectedRowsCount}
          totalRows={pagination.totalCount}
          onPageChange={(page) =>
            dispatch({ type: "SET_PAGE", payload: page + 1 })
          }
          onPageSizeChange={(size) =>
            dispatch({ type: "SET_PAGE_SIZE", payload: size })
          }
        />
      </div>
    </>
  );
};

export default OrderTable;
