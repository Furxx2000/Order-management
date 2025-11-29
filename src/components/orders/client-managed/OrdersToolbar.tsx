import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTableFacetedFilter from "@/components/ui/data-table-faceted-filter";
import { statuses, deliveryStatuses } from "../shared/constants";
import type { Order } from "@/lib/definitions";

interface OrderTableToolbarProps {
  table: Table<Order>;
}

export function OrderTableToolbar({ table }: OrderTableToolbarProps) {
  "use no memo";

  const isFiltered = table.getState().columnFilters.length > 0;
  const statusColumn = table.getColumn("status");
  const deliveryStatusColumn = table.getColumn("deliveryStatus");

  return (
    <>
      <div className="flex items-center flex-wrap py-4 gap-y-4 gap-2">
        <Input
          placeholder="Filter user or user id..."
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="max-w-2xs h-8"
        />
        {statusColumn && (
          <DataTableFacetedFilter
            title="Status"
            options={statuses}
            selectedValues={(statusColumn.getFilterValue() as string[]) || []}
            onFilterChange={(values) =>
              statusColumn.setFilterValue(
                values.length > 0 ? values : undefined
              )
            }
          />
        )}
        {deliveryStatusColumn && (
          <DataTableFacetedFilter
            title="Delivery Status"
            options={deliveryStatuses}
            selectedValues={
              (deliveryStatusColumn.getFilterValue() as string[]) || []
            }
            onFilterChange={(values) =>
              deliveryStatusColumn.setFilterValue(
                values.length > 0 ? values : undefined
              )
            }
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );
}
