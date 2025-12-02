import type { Order, DeliveryStatus } from "../definitions";

// Part 1
export function part1Calculation(orders: Order[]) {
  if (!orders.length) {
    return { userTotals: {}, topUser: null, completionRate: 0 };
  }

  const userTotalsMap = new Map<string, number>();
  const totalOrders = orders.length;
  let topUser: { name: string; total: number } | null = null;
  let completedOrdersCount = 0;

  for (const order of orders) {
    if (order.status === "completed") {
      completedOrdersCount++;
    }
    const isCompletedPaid =
      order.status === "completed" && order.paymentStatus === "paid";
    if (!isCompletedPaid) continue;

    const nextTotal = (userTotalsMap.get(order.user) || 0) + order.amount;
    userTotalsMap.set(order.user, nextTotal);

    // 更新最高消費者
    if (!topUser || nextTotal > topUser.total) {
      topUser = { name: order.user, total: nextTotal };
    }
  }

  return {
    userTotals: Object.fromEntries(userTotalsMap),
    topUser,
    completionRate: completedOrdersCount / totalOrders,
  };
}

// Part 2
export function part2Calculation(orders: Order[]) {
  if (!orders.length) {
    return { paidButNotDelivered: [], deliveryStats: {}, anomalies: [] };
  }

  const deliveryStatsMap = new Map<
    DeliveryStatus,
    { count: number; totalAmount: number }
  >();
  const paidButNotDelivered: Order[] = [];
  const anomalies: (Order & { reason: string })[] = [];

  const addAnomaly = (order: Order, reason: string) => {
    anomalies.push({ ...order, reason });
  };

  for (const order of orders) {
    // 找出已付款但未送達的訂單
    if (
      order.paymentStatus === "paid" &&
      order.deliveryStatus !== "delivered"
    ) {
      paidButNotDelivered.push(order);
    }

    // 更新 delivery status 統計
    const currentStat = deliveryStatsMap.get(order.deliveryStatus) || {
      count: 0,
      totalAmount: 0,
    };
    deliveryStatsMap.set(order.deliveryStatus, {
      count: currentStat.count + 1,
      totalAmount: currentStat.totalAmount + order.amount,
    });

    // 檢查異常訂單
    if (order.status === "completed" && order.deliveryStatus !== "delivered") {
      addAnomaly(order, "completed_but_not_delivered");
    }

    if (
      order.paymentStatus === "pending" &&
      (order.deliveryStatus === "shipping" ||
        order.deliveryStatus === "delivered")
    ) {
      addAnomaly(order, "payment_pending_but_shipping/delivered");
    }
  }

  return {
    paidButNotDelivered,
    deliveryStats: Object.fromEntries(deliveryStatsMap),
    anomalies,
  };
}
