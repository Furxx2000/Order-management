import {
  OrderSchema,
  OrdersResponseSchema,
  PaginatedOrdersResponseSchema,
  type PaginatedOrdersResponse,
} from "@/lib/definitions";

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
    console.error("Zod Validation Error:", result.error);
    throw new Error("API 資料格式不符合");
  }
};

export const fetchPaginatedOrders = async (
  page = 1,
  pageSize = 5,
  sortId?: string,
  sortDirection?: "asc" | "desc",
  search?: string,
  filters?: Record<string, string[]>,
  signal?: AbortSignal
): Promise<PaginatedOrdersResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (sortId && sortDirection) {
    params.append("sortId", sortId);
    params.append("sortDirection", sortDirection);
  }

  if (search) params.append("search", search);

  if (filters) {
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.append(key, values.join(","));
      }
    });
  }

  const res = await fetch(`/api/orders/paginated?${params}`, {
    method: "GET",
    signal,
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(errorData.message || "Failed to fetch orders");
  }

  const data = await res.json();

  const result = PaginatedOrdersResponseSchema.safeParse(data);

  if (result.success) {
    return result.data;
  } else {
    console.error("Zod Validation Error:", result.error);
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
  const result = OrderSchema.safeParse(data);

  if (result.success) {
    return result.data;
  } else {
    throw new Error("API 資料格式不符合");
  }
};
