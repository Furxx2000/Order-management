import { cn } from "@/lib/utils";
import type { Column } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

interface DataTableSortHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

const DataTableSortHeader = <TData, TValue>({
  column,
  title,
  className,
}: DataTableSortHeaderProps<TData, TValue>) => {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  let sortIcon = <ChevronsUpDown />;
  if (column.getIsSorted() === "desc") sortIcon = <ArrowDown />;
  if (column.getIsSorted() === "asc") sortIcon = <ArrowUp />;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="focus-visible:ring-0 cursor-pointer"
          asChild
        >
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-[10px] h-8"
          >
            <span>{title}</span>
            {sortIcon}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => column.toggleSorting(false)}
          >
            <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => column.toggleSorting(true)}
          >
            <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DataTableSortHeader;
