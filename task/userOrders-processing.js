const orders = [
  {
    id: 1,
    user: "Alice",
    amount: 1500,
    status: "completed",
    paymentStatus: "paid",
    deliveryStatus: "delivered",
    date: "2024-11-01",
  },
  {
    id: 2,
    user: "Bob",
    amount: 2300,
    status: "pending",
    paymentStatus: "paid",
    deliveryStatus: "shipping",
    date: "2024-11-03",
  },
  {
    id: 3,
    user: "Alice",
    amount: 800,
    status: "completed",
    paymentStatus: "paid",
    deliveryStatus: "delivered",
    date: "2024-11-05",
  },
  {
    id: 4,
    user: "Charlie",
    amount: 3200,
    status: "cancelled",
    paymentStatus: "refunded",
    deliveryStatus: "cancelled",
    date: "2024-11-02",
  },
  {
    id: 5,
    user: "Bob",
    amount: 1200,
    status: "completed",
    paymentStatus: "paid",
    deliveryStatus: "delivered",
    date: "2024-11-04",
  },
  {
    id: 6,
    user: "Alice",
    amount: 4500,
    status: "processing",
    paymentStatus: "paid",
    deliveryStatus: "preparing",
    date: "2024-11-06",
  },
  {
    id: 7,
    user: "David",
    amount: 980,
    status: "pending",
    paymentStatus: "pending",
    deliveryStatus: "pending",
    date: "2024-11-07",
  },
  {
    id: 8,
    user: "Bob",
    amount: 2100,
    status: "completed",
    paymentStatus: "paid",
    deliveryStatus: "delivered",
    date: "2024-11-08",
  },
];

// Part 1

function part1Calculation(orders) {
  if (!orders.length) {
    return { userTotals: {}, topUser: null, completionRate: 0 };
  }

  const userTotalsMap = new Map();
  const totalOrders = orders.length;
  let topUser = null;
  let completedOrdersCount = 0;

  for (const order of orders) {
    // 只計算已完成且已付款的訂單
    const isCompletedPaid =
      order.status === "completed" && order.paymentStatus === "paid";
    if (!isCompletedPaid) continue;

    completedOrdersCount++;

    // 更新使用者總金額
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
const part1Result = part1Calculation(orders);
console.log("========= Part 1 =========");
console.log(part1Result);
console.log("\n");

function part2Calculation(orders) {
  if (!orders.length) {
    return { paidButNotDelivered: [], deliveryStatus: {}, anomalies: [] };
  }

  const deliveryStatsMap = new Map();
  const paidButNotDelivered = [];
  const anomalies = [];

  const addAnomaly = (order, reason) => {
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
    deliveryStatsMap.set(order.deliveryStatus, {
      count: (deliveryStatsMap.get(order.deliveryStatus)?.count || 0) + 1,
      totalAmount:
        (deliveryStatsMap.get(order.deliveryStatus)?.totalAmount || 0) +
        order.amount,
    });

    // 檢查異常訂單
    if (order.status === "completed" && order.deliveryStatus !== "delivered") {
      addAnomaly(order, "completed_but_not_delivered");
    }

    if (
      order.paymentStatus === "pending" &&
      order.deliveryStatus === "shipping"
    ) {
      addAnomaly(order, "payment_pending_but_shipping");
    }
  }

  return {
    paidButNotDelivered,
    deliveryStatus: Object.fromEntries(deliveryStatsMap),
    anomalies,
  };
}

const part2Result = part2Calculation(orders);
console.log("========= Part 2 =========");
console.log(part2Result);
