import { delay, http, HttpResponse } from "msw";
import { MOCK_ORDERS } from "@/data/orders";
import * as z from "zod";
import { DeliveryStatusSchema } from "@/lib/definitions";

const newDeliveryStatusSchema = z.object({
  deliveryStatus: DeliveryStatusSchema,
});

export const handlers = [
  http.get("/api/orders", async () => {
    await delay(500);
    return HttpResponse.json(MOCK_ORDERS);
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
