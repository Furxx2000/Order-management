import { describe, it, expect } from "vitest";
import { part1Calculation, part2Calculation } from "./calculations";
import type { Order } from "../definitions";

// Helper to create mock orders
const createMockOrder = (
  id: string,
  user: string,
  amount: number,
  status: Order["status"],
  paymentStatus: Order["paymentStatus"],
  deliveryStatus: Order["deliveryStatus"]
): Order => ({
  id,
  user,
  amount,
  status,
  paymentStatus,
  deliveryStatus,
  date: new Date().toISOString(),
});

describe("calculations", () => {
  describe("part1Calculation", () => {
    it("returns empty stats for empty orders", () => {
      const result = part1Calculation([]);
      expect(result).toEqual({
        userTotals: {},
        topUser: null,
        completionRate: 0,
      });
    });

    it("calculates user totals correctly for completed and paid orders", () => {
      const orders = [
        createMockOrder("1", "User A", 100, "completed", "paid", "delivered"),
        createMockOrder("2", "User A", 50, "completed", "paid", "delivered"),
        createMockOrder("3", "User B", 200, "completed", "paid", "delivered"),
        // Should be ignored
        createMockOrder("4", "User A", 100, "pending", "paid", "delivered"),
        createMockOrder(
          "5",
          "User B",
          100,
          "completed",
          "pending",
          "delivered"
        ),
      ];

      const result = part1Calculation(orders);
      expect(result.userTotals).toEqual({
        "User A": 150,
        "User B": 200,
      });
    });

    it("identifies the top user", () => {
      const orders = [
        createMockOrder("1", "User A", 100, "completed", "paid", "delivered"),
        createMockOrder("2", "User B", 200, "completed", "paid", "delivered"),
        createMockOrder("3", "User A", 50, "completed", "paid", "delivered"),
      ];

      const result = part1Calculation(orders);
      expect(result.topUser).toEqual({ name: "User B", total: 200 });
    });

    it("calculates completion rate correctly", () => {
      const orders = [
        createMockOrder("1", "User A", 100, "completed", "paid", "delivered"),
        createMockOrder("2", "User B", 100, "pending", "paid", "delivered"),
        createMockOrder(
          "3",
          "User C",
          100,
          "completed",
          "pending",
          "delivered"
        ),
        createMockOrder("4", "User D", 100, "cancelled", "paid", "delivered"),
      ];

      // 2 completed orders out of 4 total
      const result = part1Calculation(orders);
      expect(result.completionRate).toBe(0.5);
    });
  });

  describe("part2Calculation", () => {
    it("returns empty stats for empty orders", () => {
      const result = part2Calculation([]);
      expect(result).toEqual({
        paidButNotDelivered: [],
        deliveryStats: {},
        anomalies: [],
      });
    });

    it("identifies paid but not delivered orders", () => {
      const orders = [
        createMockOrder("1", "User A", 100, "completed", "paid", "shipping"),
        createMockOrder("2", "User B", 100, "completed", "paid", "delivered"),
        createMockOrder("3", "User C", 100, "completed", "pending", "shipping"),
      ];

      const result = part2Calculation(orders);
      expect(result.paidButNotDelivered).toHaveLength(1);
      expect(result.paidButNotDelivered[0].id).toBe("1");
    });

    it("aggregates delivery stats correctly", () => {
      const orders = [
        createMockOrder("1", "User A", 100, "completed", "paid", "shipping"),
        createMockOrder("2", "User B", 200, "completed", "paid", "shipping"),
        createMockOrder("3", "User C", 300, "completed", "paid", "delivered"),
      ];

      const result = part2Calculation(orders);
      expect(result.deliveryStats).toEqual({
        shipping: { count: 2, totalAmount: 300 },
        delivered: { count: 1, totalAmount: 300 },
      });
    });

    it("detects anomalies: completed but not delivered", () => {
      const orders = [
        createMockOrder("1", "User A", 100, "completed", "paid", "shipping"),
      ];

      const result = part2Calculation(orders);
      expect(result.anomalies).toHaveLength(1);
      expect(result.anomalies[0].reason).toBe("completed_but_not_delivered");
    });

    it("detects anomalies: payment pending but shipping/delivered", () => {
      const orders = [
        createMockOrder(
          "1",
          "User A",
          100,
          "processing",
          "pending",
          "shipping"
        ),
        createMockOrder(
          "2",
          "User B",
          100,
          "processing",
          "pending",
          "delivered"
        ),
      ];

      const result = part2Calculation(orders);
      expect(result.anomalies).toHaveLength(2);
      expect(result.anomalies[0].reason).toBe(
        "payment_pending_but_shipping/delivered"
      );
      expect(result.anomalies[1].reason).toBe(
        "payment_pending_but_shipping/delivered"
      );
    });
  });
});
