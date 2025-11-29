import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const OrderTableSkeleton = () => {
  return (
    <Card className="py-8 shadow-none border-none">
      <CardHeader>
        <Skeleton className="h-8 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card text-card-foreground shadow p-6"
            >
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <div className="pt-2">
                <Skeleton className="h-8 w-[120px] mb-1" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center py-4 gap-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-8 w-[90px]" />
          <Skeleton className="h-8 w-[130px]" />
        </div>

        <div className="rounded-md border">
          <div className="border-b px-4 py-3">
            <div className="flex gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </div>
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-8 w-[150px]" />
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-8 w-[120px]" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Skeleton className="h-8 w-[250px]" />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTableSkeleton;
