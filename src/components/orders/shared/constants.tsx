import {
  CheckCircle2,
  Clock,
  LoaderCircle,
  Package,
  Truck,
  Undo2,
  XCircle,
} from "lucide-react";
import type { Status } from "@/components/ui/ComboBoxResponsive";

export const orderStatusMap: Record<string, string> = {
  pending: "bg-[#FCD34D]",
  processing: "bg-[#60A5FA]",
  completed: "bg-[#4ADE80]",
  cancelled: "bg-[#F87171]",
};

export const orderStatusIconMap = {
  pending: Clock,
  processing: LoaderCircle,
  completed: CheckCircle2,
  cancelled: XCircle,
};

export const paymentStatusIconMap = {
  pending: Clock,
  paid: CheckCircle2,
  refunded: Undo2,
};

export const paymentStatusIconColorMap: Record<string, string> = {
  pending: "text-[#FB923C]",
  paid: "text-[#4ADE80]",
  refunded: "text-[#9CA3AF]",
};

export const statuses: Status[] = [
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

export const deliveryStatuses: Status[] = [
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
