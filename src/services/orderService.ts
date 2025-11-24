import { OrderSchema, OrdersResponseSchema } from "@/lib/definitions";

export const fetchOrders = async () => {
  const res = await fetch("/api/orders");

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(errorData.message || "Failed to update status");
  }

  const data = await res.json();
  const result = OrdersResponseSchema.safeParse(data);

  if (result.success) {
    return result.data;
  } else {
    throw new Error("API 資料格式不符合");
  }
};

export const updateOrderDeliveryStatus = async (
  orderId: string,
  deliveryStatus: string
) => {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deliveryStatus }),
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(errorData.message || "Failed to update status");
  }

  const data = await res.json();
  console.log(data);
  const result = OrderSchema.safeParse(data);

  if (result.success) {
    return result.data;
  } else {
    throw new Error("API 資料格式不符合");
  }
};
