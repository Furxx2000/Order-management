import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useOrderState } from "./useOrderState";
import { fetchPaginatedOrders } from "@/services/orderService";
import { toast } from "sonner";
import type { Order } from "@/lib/definitions";

// Mock dependencies
vi.mock("@/services/orderService", () => ({
  fetchPaginatedOrders: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock useDebounce to return value immediately for easier testing
vi.mock("@/hooks/useDebounce", () => ({
  default: (value: any) => value,
}));

const mockOrders: Order[] = [
  {
    id: "1",
    user: "User 1",
    date: "2023-01-01",
    amount: 100,
    status: "completed",
    paymentStatus: "paid",
    deliveryStatus: "delivered",
  },
  {
    id: "2",
    user: "User 2",
    date: "2023-01-02",
    amount: 200,
    status: "pending",
    paymentStatus: "pending",
    deliveryStatus: "pending",
  },
];

const mockResponse = {
  data: mockOrders,
  meta: {
    total: 10,
    totalPages: 2,
    page: 1,
    pageSize: 5,
  },
  stats: {
    totalAmount: 300,
    pendingCount: 1,
    processingCount: 0,
    shippingCount: 0,
  },
};

describe("useOrderState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetchPaginatedOrders as any).mockResolvedValue(mockResponse);
  });

  it("initializes with default state and fetches data", async () => {
    const { result } = renderHook(() => useOrderState());

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.orders).toEqual([]);

    // Wait for data fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.orders).toEqual(mockOrders);
    expect(result.current.totalCount).toBe(10);
    expect(result.current.pageCount).toBe(2);
    expect(result.current.stats).toEqual(mockResponse.stats);
  });

  it("handles pagination changes", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Change page
    act(() => {
      result.current.dispatch({ type: "SET_PAGE", payload: 2 });
    });

    expect(result.current.page).toBe(2);

    // Verify fetch called with new page
    await waitFor(() => {
      expect(fetchPaginatedOrders).toHaveBeenCalledWith(
        2, // page
        5, // pageSize
        undefined, // sortId
        undefined, // sortDirection
        "", // search
        {}, // filters
        expect.any(AbortSignal)
      );
    });
  });

  it("handles sorting changes", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Change sorting
    act(() => {
      result.current.dispatch({
        type: "SET_SORTING",
        payload: { id: "amount", direction: "desc" },
      });
    });

    expect(result.current.sorting).toEqual({ id: "amount", direction: "desc" });

    // Verify fetch called with sorting
    await waitFor(() => {
      expect(fetchPaginatedOrders).toHaveBeenCalledWith(
        1,
        5,
        "amount",
        "desc",
        "",
        {},
        expect.any(AbortSignal)
      );
    });
  });

  it("handles search changes", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Change search
    act(() => {
      result.current.dispatch({ type: "SET_SEARCH", payload: "test query" });
    });

    expect(result.current.search).toBe("test query");
    expect(result.current.page).toBe(1); // Should reset to page 1

    // Verify fetch called with search (mocked debounce passes through immediately)
    await waitFor(() => {
      expect(fetchPaginatedOrders).toHaveBeenCalledWith(
        1,
        5,
        undefined,
        undefined,
        "test query",
        {},
        expect.any(AbortSignal)
      );
    });
  });

  it("handles filter changes", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Set filter
    act(() => {
      result.current.dispatch({
        type: "SET_FILTER",
        payload: { key: "status", value: ["completed"] },
      });
    });

    expect(result.current.filters).toEqual({ status: ["completed"] });
    expect(result.current.page).toBe(1); // Should reset to page 1

    // Verify fetch called with filters
    await waitFor(() => {
      expect(fetchPaginatedOrders).toHaveBeenCalledWith(
        1,
        5,
        undefined,
        undefined,
        "",
        { status: ["completed"] },
        expect.any(AbortSignal)
      );
    });
  });

  it("handles filter reset", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Set filter first
    act(() => {
      result.current.dispatch({
        type: "SET_FILTER",
        payload: { key: "status", value: ["completed"] },
      });
    });

    // Reset filters
    act(() => {
      result.current.dispatch({ type: "RESET_FILTERS" });
    });

    expect(result.current.filters).toEqual({});
    expect(result.current.page).toBe(1);

    // Verify fetch called with empty filters
    await waitFor(() => {
      expect(fetchPaginatedOrders).toHaveBeenLastCalledWith(
        1,
        5,
        undefined,
        undefined,
        "",
        {},
        expect.any(AbortSignal)
      );
    });
  });

  it("handles fetch errors", async () => {
    const error = new Error("Fetch failed");
    (fetchPaginatedOrders as any).mockRejectedValue(error);

    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Fetch failed");
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("handles optimistic updates correctly", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Update order amount
    act(() => {
      result.current.dispatch({
        type: "UPDATE_ORDER",
        payload: { orderId: "1", updates: { amount: 150 } },
      });
    });

    // Verify order updated
    const updatedOrder = result.current.orders.find((o) => o.id === "1");
    expect(updatedOrder?.amount).toBe(150);

    // Verify stats updated (original 300, +50 change = 350)
    expect(result.current.stats.totalAmount).toBe(350);
  });

  it("handles row selection", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Toggle single row
    act(() => {
      result.current.dispatch({
        type: "TOGGLE_ROW",
        payload: { orderId: "1", value: true },
      });
    });

    expect(result.current.rowSelection["1"]).toBe(true);

    // Toggle all rows
    act(() => {
      result.current.dispatch({
        type: "TOGGLE_ALL_ROWS",
        payload: true,
      });
    });

    expect(result.current.rowSelection["1"]).toBe(true);
    expect(result.current.rowSelection["2"]).toBe(true);

    // Untoggle all rows
    act(() => {
      result.current.dispatch({
        type: "TOGGLE_ALL_ROWS",
        payload: false,
      });
    });

    expect(result.current.rowSelection).toEqual({});
  });

  it("calculates isFiltered correctly", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isFiltered).toBe(false);

    // Add search
    act(() => {
      result.current.dispatch({ type: "SET_SEARCH", payload: "query" });
    });

    // Wait for the side effect (fetch) to start/complete to avoid act warnings
    await waitFor(() => {
      expect(fetchPaginatedOrders).toHaveBeenCalledTimes(2); // 1st on mount, 2nd on search
    });

    expect(result.current.isFiltered).toBe(true);

    // Clear search
    act(() => {
      result.current.dispatch({ type: "SET_SEARCH", payload: "" });
    });

    await waitFor(() => {
      expect(fetchPaginatedOrders).toHaveBeenCalledTimes(3);
    });

    expect(result.current.isFiltered).toBe(false);

    // Add filter
    act(() => {
      result.current.dispatch({
        type: "SET_FILTER",
        payload: { key: "status", value: ["pending"] },
      });
    });

    await waitFor(() => {
      expect(fetchPaginatedOrders).toHaveBeenCalledTimes(4);
    });

    expect(result.current.isFiltered).toBe(true);
  });

  it("handles page size changes and resets to page 1", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Change to page 2 first
    act(() => {
      result.current.dispatch({ type: "SET_PAGE", payload: 2 });
    });

    expect(result.current.page).toBe(2);

    // Change page size
    act(() => {
      result.current.dispatch({ type: "SET_PAGE_SIZE", payload: 10 });
    });

    expect(result.current.pageSize).toBe(10);
    expect(result.current.page).toBe(1); // Should reset to page 1

    // Verify fetch called with new page size
    await waitFor(() => {
      expect(fetchPaginatedOrders).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
        "",
        {},
        expect.any(AbortSignal)
      );
    });
  });

  it("updates status counts when order status changes", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialPendingCount = result.current.stats.pendingCount;
    const initialProcessingCount = result.current.stats.processingCount;

    // Change status from pending to processing
    act(() => {
      result.current.dispatch({
        type: "UPDATE_ORDER",
        payload: { orderId: "2", updates: { status: "processing" } },
      });
    });

    expect(result.current.stats.pendingCount).toBe(initialPendingCount - 1);
    expect(result.current.stats.processingCount).toBe(
      initialProcessingCount + 1
    );

    // Change back to pending
    act(() => {
      result.current.dispatch({
        type: "UPDATE_ORDER",
        payload: { orderId: "2", updates: { status: "pending" } },
      });
    });

    expect(result.current.stats.pendingCount).toBe(initialPendingCount);
    expect(result.current.stats.processingCount).toBe(initialProcessingCount);
  });

  it("updates shipping count when delivery status changes", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialShippingCount = result.current.stats.shippingCount;

    // Change delivery status to shipping
    act(() => {
      result.current.dispatch({
        type: "UPDATE_ORDER",
        payload: { orderId: "1", updates: { deliveryStatus: "shipping" } },
      });
    });

    expect(result.current.stats.shippingCount).toBe(initialShippingCount + 1);

    // Change back to delivered
    act(() => {
      result.current.dispatch({
        type: "UPDATE_ORDER",
        payload: { orderId: "1", updates: { deliveryStatus: "delivered" } },
      });
    });

    expect(result.current.stats.shippingCount).toBe(initialShippingCount);
  });

  it("returns same state when updating non-existent order", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const stateBefore = { ...result.current };

    // Try to update non-existent order
    act(() => {
      result.current.dispatch({
        type: "UPDATE_ORDER",
        payload: { orderId: "999", updates: { amount: 500 } },
      });
    });

    // State should remain unchanged
    expect(result.current.orders).toEqual(stateBefore.orders);
    expect(result.current.stats).toEqual(stateBefore.stats);
  });

  it("handles non-Error type errors gracefully", async () => {
    (fetchPaginatedOrders as any).mockRejectedValue("String error");

    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "An unknown error occurred while fetching orders."
      );
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("handles row deselection", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Select row first
    act(() => {
      result.current.dispatch({
        type: "TOGGLE_ROW",
        payload: { orderId: "1", value: true },
      });
    });

    expect(result.current.rowSelection["1"]).toBe(true);

    // Deselect row
    act(() => {
      result.current.dispatch({
        type: "TOGGLE_ROW",
        payload: { orderId: "1", value: false },
      });
    });

    expect(result.current.rowSelection["1"]).toBe(false);
  });

  it("handles multiple filters simultaneously", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Set first filter
    act(() => {
      result.current.dispatch({
        type: "SET_FILTER",
        payload: { key: "status", value: ["completed"] },
      });
    });

    // Set second filter
    act(() => {
      result.current.dispatch({
        type: "SET_FILTER",
        payload: { key: "paymentStatus", value: ["paid"] },
      });
    });

    expect(result.current.filters).toEqual({
      status: ["completed"],
      paymentStatus: ["paid"],
    });

    // Verify fetch called with both filters
    await waitFor(() => {
      expect(fetchPaginatedOrders).toHaveBeenCalledWith(
        1,
        5,
        undefined,
        undefined,
        "",
        { status: ["completed"], paymentStatus: ["paid"] },
        expect.any(AbortSignal)
      );
    });
  });

  it("handles clearing specific filter by setting empty array", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Set multiple filters
    act(() => {
      result.current.dispatch({
        type: "SET_FILTER",
        payload: { key: "status", value: ["completed"] },
      });
    });

    act(() => {
      result.current.dispatch({
        type: "SET_FILTER",
        payload: { key: "paymentStatus", value: ["paid"] },
      });
    });

    // Clear specific filter with empty array
    act(() => {
      result.current.dispatch({
        type: "SET_FILTER",
        payload: { key: "status", value: [] },
      });
    });

    expect(result.current.filters).toEqual({
      status: [],
      paymentStatus: ["paid"],
    });

    // isFiltered should still be true because paymentStatus filter exists
    expect(result.current.isFiltered).toBe(true);
  });

  it("handles sorting direction changes", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Set ascending sort
    act(() => {
      result.current.dispatch({
        type: "SET_SORTING",
        payload: { id: "amount", direction: "asc" },
      });
    });

    expect(result.current.sorting).toEqual({ id: "amount", direction: "asc" });

    await waitFor(() => {
      expect(fetchPaginatedOrders).toHaveBeenCalledWith(
        1,
        5,
        "amount",
        "asc",
        "",
        {},
        expect.any(AbortSignal)
      );
    });

    // Change to descending
    act(() => {
      result.current.dispatch({
        type: "SET_SORTING",
        payload: { id: "amount", direction: "desc" },
      });
    });

    expect(result.current.sorting).toEqual({
      id: "amount",
      direction: "desc",
    });

    await waitFor(() => {
      expect(fetchPaginatedOrders).toHaveBeenCalledWith(
        1,
        5,
        "amount",
        "desc",
        "",
        {},
        expect.any(AbortSignal)
      );
    });
  });

  it("updates multiple order properties simultaneously", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Update multiple properties at once
    act(() => {
      result.current.dispatch({
        type: "UPDATE_ORDER",
        payload: {
          orderId: "2",
          updates: {
            amount: 250,
            status: "processing",
            deliveryStatus: "shipping",
          },
        },
      });
    });

    const updatedOrder = result.current.orders.find((o) => o.id === "2");
    expect(updatedOrder?.amount).toBe(250);
    expect(updatedOrder?.status).toBe("processing");
    expect(updatedOrder?.deliveryStatus).toBe("shipping");

    // Verify stats updated correctly
    expect(result.current.stats.totalAmount).toBe(350); // 300 + 50
    expect(result.current.stats.pendingCount).toBe(0); // pending to processing
    expect(result.current.stats.processingCount).toBe(1);
    expect(result.current.stats.shippingCount).toBe(1); // pending to shipping
  });

  it("handles rapidly changing parameters (simulates abort scenario)", async () => {
    const { result } = renderHook(() => useOrderState());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Rapidly change page multiple times
    act(() => {
      result.current.dispatch({ type: "SET_PAGE", payload: 2 });
    });

    act(() => {
      result.current.dispatch({ type: "SET_PAGE", payload: 3 });
    });

    act(() => {
      result.current.dispatch({ type: "SET_PAGE", payload: 4 });
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should end up on page 4
    expect(result.current.page).toBe(4);

    // Verify the last fetch was called with page 4
    expect(fetchPaginatedOrders).toHaveBeenLastCalledWith(
      4,
      5,
      undefined,
      undefined,
      "",
      {},
      expect.any(AbortSignal)
    );
  });
});
