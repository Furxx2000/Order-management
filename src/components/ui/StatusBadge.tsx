import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";
import type { LucideIcon } from "lucide-react";

type Status = string;

interface StatusBadgeProps {
  status: Status;
  statusMap?: Record<Status, string>;
  iconMap?: Record<Status, LucideIcon>;
  iconColorMap?: Record<Status, string>;
  className?: string;
}

export const StatusBadge = ({
  status,
  statusMap,
  iconMap,
  iconColorMap,
  className,
}: StatusBadgeProps) => {
  const defaultBadgeClass = "bg-white border border-gray-200 text-gray-700";
  const badgeClass = statusMap?.[status] || defaultBadgeClass;

  const Icon = iconMap?.[status];
  const iconColorClass = iconColorMap?.[status] || "text-white";

  return (
    <Badge
      className={cn(
        "capitalize rounded-full px-1.5 text-xs font-medium",
        badgeClass,
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className={cn("h-3 w-3", iconColorClass)} />}
        <span>{status}</span>
      </div>
    </Badge>
  );
};
