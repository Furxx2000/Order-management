import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type FilterFn,
  type SortingState,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import { rankItem, type RankingInfo } from "@tanstack/match-sorter-utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Input } from "./input";
import DataTablePagination from "./data-table-pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import DataTableFacetedFilter from "./data-table-faceted-filter";
import type { Status } from "./ComboBoxResponsive";
import { Button } from "./button";
import {
  CheckCircle2,
  Clock,
  LoaderCircle,
  Package,
  Truck,
  X,
  XCircle,
} from "lucide-react";
import DataTableStats from "./data-table-stats";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tableData: TData[];
}

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const statuses: Status[] = [
  {
    value: "pending",
    label: "Pending",
    icon: <Clock className="h-4 w-4 text-[#FCD34D]" />,
  },
  {
    value: "processing",
    label: "Processing",
    icon: <LoaderCircle className="h-4 w-4 text-[#60A5FA]" />,
  },
  {
    value: "completed",
    label: "Completed",
    icon: <CheckCircle2 className="h-4 w-4 text-[#4ADE80]" />,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: <XCircle className="h-4 w-4 text-[#F87171]" />,
  },
];

const deliveryStatuses: Status[] = [
  {
    value: "pending",
    label: "Pending",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    value: "preparing",
    label: "Preparing",
    icon: <Package className="h-4 w-4" />,
  },
  {
    value: "shipping",
    label: "Shipping",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    value: "delivered",
    label: "Delivered",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: <XCircle className="h-4 w-4" />,
  },
];

const DataTable = <TData, TValue>({
  columns,
  tableData,
}: DataTableProps<TData, TValue>) => {
  const [data, setData] = useState(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const updateOrderInState = (
    rowIndex: number,
    columnId: string,
    value: string
  ) => {
    setData((prev) =>
      prev.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...prev[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "fuzzy",
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    meta: {
      updateOrderInState,
    },
  });

  useEffect(() => {
    table.setPageIndex(0);
  }, [globalFilter, columnFilters, table]);

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <Card className="py-8 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
        <CardDescription>
          Here's a list of the orders every month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTableStats table={table} />
        <div className="flex items-center flex-wrap py-4 gap-2">
          <Input
            placeholder="Filter user or user id..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-2xs h-8"
          />
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
            />
          )}
          {table.getColumn("deliveryStatus") && (
            <DataTableFacetedFilter
              column={table.getColumn("deliveryStatus")}
              title="Delivery Status"
              options={deliveryStatuses}
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
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={1} className="pl-5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="pl-5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <DataTablePagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
