import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

interface DataTableSortHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  sortDirection: "asc" | "desc" | false;
  onSort: (direction: "asc" | "desc" | false) => void;
}

const DataTableSortHeader = ({
  title,
  sortDirection,
  onSort,
  className,
}: DataTableSortHeaderProps) => {
  if (!onSort) {
    return <div className={cn(className)}>{title}</div>;
  }

  let sortIcon = <ChevronsUpDown />;
  if (sortDirection === "desc") sortIcon = <ArrowDown />;
  if (sortDirection === "asc") sortIcon = <ArrowUp />;

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
            onClick={() => onSort("asc")}
          >
            <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onSort("desc")}
          >
            <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onSort(false)}
          >
            <ChevronsUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Clear
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DataTableSortHeader;
