import * as z from "zod";

// --- Order Status ---
// 定義陣列
export const ORDER_STATUSES = [
  "pending",
  "processing",
  "completed",
  "cancelled",
] as const;
// 建立 Zod Schema
export const OrderStatusSchema = z.enum(ORDER_STATUSES);
// 建立 TS Type
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

// --- Payment Status ---
export const PAYMENT_STATUSES = ["pending", "paid", "refunded"] as const;
export const PaymentStatusSchema = z.enum(PAYMENT_STATUSES);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

// --- Delivery Status ---
export const DELIVERY_STATUSES = [
  "pending",
  "preparing",
  "shipping",
  "delivered",
  "cancelled",
] as const;
export const DeliveryStatusSchema = z.enum(DELIVERY_STATUSES);
export type DeliveryStatus = z.infer<typeof DeliveryStatusSchema>;

// --- Order ---
export const OrderSchema = z.object({
  id: z.string(),
  user: z.string(),
  amount: z.number(),
  status: OrderStatusSchema,
  paymentStatus: PaymentStatusSchema,
  deliveryStatus: DeliveryStatusSchema,
  date: z.string(),
});

export type Order = z.infer<typeof OrderSchema>;

export const OrdersResponseSchema = z.array(OrderSchema);
export type Orders = z.infer<typeof OrdersResponseSchema>;
