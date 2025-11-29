import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrdersTableSkeletonProps {
  rowCount?: number;
}

const OrdersTableSkeleton = ({ rowCount = 5 }: OrdersTableSkeletonProps) => {
  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(8)].map((_, i) => (
                <TableHead key={i} className="pl-5">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(rowCount)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(8)].map((_, j) => (
                  <TableCell key={j} className="pl-5">
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 模擬 Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-8 w-[250px]" />
      </div>
    </div>
  );
};

export default OrdersTableSkeleton;
