import { delay, http, HttpResponse } from "msw";
import { MOCK_ORDERS } from "@/data/orders";
import * as z from "zod";
import { DeliveryStatusSchema } from "@/lib/definitions";
import { fuzzyMatch } from "@/lib/utils";

const newDeliveryStatusSchema = z.object({
  deliveryStatus: DeliveryStatusSchema,
});

export const handlers = [
  http.get("/api/orders", async () => {
    await delay(500);
    return HttpResponse.json(MOCK_ORDERS);
  }),
  http.get("/api/orders/paginated", async ({ request }) => {
    await delay(500);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Number(url.searchParams.get("pageSize") || "5");
    const sortId = url.searchParams.get("sortId");
    const sortDirection = url.searchParams.get("sortDirection");
    const search = url.searchParams.get("search")?.toLowerCase() || "";

    const statusFilter = url.searchParams.get("status")?.split(",") || [];
    const deliveryStatusFilter =
      url.searchParams.get("deliveryStatus")?.split(",") || [];

    let filteredOrders = [...MOCK_ORDERS];

    if (search) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          fuzzyMatch(search, order.user) || fuzzyMatch(search, order.id)
      );
    }

    if (statusFilter.length > 0) {
      filteredOrders = filteredOrders.filter((order) =>
        statusFilter.includes(order.status)
      );
    }

    if (deliveryStatusFilter.length > 0) {
      filteredOrders = filteredOrders.filter((order) =>
        deliveryStatusFilter.includes(order.deliveryStatus)
      );
    }

    const sortedOrders = [...filteredOrders];

    if (sortId && sortDirection) {
      sortedOrders.sort((a, b) => {
        const aValue = a[sortId as keyof typeof a];
        const bValue = b[sortId as keyof typeof b];

        // Handle sorting for numbers(Amount)
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        // Handle sorting for strings(Date)
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const paginatedOrders = sortedOrders.slice(start, end);

    const stats = filteredOrders.reduce(
      (acc, order) => {
        acc.totalAmount += order.amount;
        if (order.status === "pending") acc.pendingCount++;
        if (order.status === "processing") acc.processingCount++;
        if (order.deliveryStatus === "shipping") acc.shippingCount++;
        return acc;
      },
      { totalAmount: 0, pendingCount: 0, processingCount: 0, shippingCount: 0 }
    );

    return HttpResponse.json({
      data: paginatedOrders,
      meta: {
        total: filteredOrders.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredOrders.length / pageSize),
      },
      stats,
    });
  }),
  http.patch("/api/orders/:orderId", async ({ request, params }) => {
    const { orderId } = params;
    const json = await request.json();

    const validationResult = newDeliveryStatusSchema.safeParse(json);

    if (!validationResult.success) {
      return HttpResponse.json(
        {
          message: "Invalid request body",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { deliveryStatus: newDeliveryStatus } = validationResult.data;

    const orderIndex = MOCK_ORDERS.findIndex((order) => order.id === orderId);
    if (orderIndex === -1) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const order = MOCK_ORDERS[orderIndex];

    // 狀態規則 1: 如果訂單狀態是 cancelled，配送狀態只能是 cancelled。
    if (order.status === "cancelled" && newDeliveryStatus !== "cancelled") {
      return HttpResponse.json(
        { message: "已取消訂單的配送狀態只能是 'cancelled'" },
        { status: 400 }
      );
    }

    // 狀態規則 2: 如果付款狀態是 pending，配送狀態不能更新為 shipping 或 delivered。
    if (
      order.paymentStatus === "pending" &&
      ["shipping", "delivered"].includes(newDeliveryStatus)
    ) {
      return HttpResponse.json(
        { message: "待付款訂單不能更新為 'shipping' 或 'delivered'" },
        { status: 400 }
      );
    }

    // 更新配送狀態
    MOCK_ORDERS[orderIndex].deliveryStatus = newDeliveryStatus;
    await delay(800);
    return HttpResponse.json(MOCK_ORDERS[orderIndex]);
  }),
];
