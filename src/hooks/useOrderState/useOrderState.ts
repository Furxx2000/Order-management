import { useReducer, useEffect } from "react";
import { toast } from "sonner";
import useDebounce from "@/hooks/useDebounce/useDebounce";
import { fetchPaginatedOrders } from "@/services/orderService";
import type {
  State,
  Action,
  OrderContextType,
} from "@/context/useOrderContext";

const initialState: State = {
  orders: [],
  isLoading: true,
  page: 1,
  pageSize: 5,
  sorting: null,
  totalCount: 0,
  pageCount: 0,
  stats: {
    totalAmount: 0,
    pendingCount: 0,
    processingCount: 0,
    shippingCount: 0,
  },
  search: "",
  filters: {},
  rowSelection: {},
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_DATA":
      return {
        ...state,
        orders: action.payload.orders,
        totalCount: action.payload.total,
        pageCount: action.payload.totalPages,
        stats: action.payload.stats,
        isLoading: false,
      };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload, page: 1 };
    case "SET_SORTING":
      return { ...state, sorting: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
        page: 1,
      };
    case "RESET_FILTERS":
      return { ...state, filters: {}, page: 1 };
    case "UPDATE_ORDER": {
      const { orderId, updates } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return state;

      const newOrder = { ...order, ...updates };
      const newOrders = state.orders.map((o) =>
        o.id === orderId ? newOrder : o
      );

      const newStats = { ...state.stats };

      if (order.amount !== newOrder.amount) {
        newStats.totalAmount += newOrder.amount - order.amount;
      }

      if (order.status !== newOrder.status) {
        if (order.status === "pending") newStats.pendingCount--;
        if (order.status === "processing") newStats.processingCount--;

        if (newOrder.status === "pending") newStats.pendingCount++;
        if (newOrder.status === "processing") newStats.processingCount++;
      }

      if (order.deliveryStatus !== newOrder.deliveryStatus) {
        if (order.deliveryStatus === "shipping") newStats.shippingCount--;
        if (newOrder.deliveryStatus === "shipping") newStats.shippingCount++;
      }

      return { ...state, orders: newOrders, stats: newStats };
    }
    case "TOGGLE_ROW":
      return {
        ...state,
        rowSelection: {
          ...state.rowSelection,
          [action.payload.orderId]: action.payload.value,
        },
      };
    case "TOGGLE_ALL_ROWS": {
      const newSelection = { ...state.rowSelection };
      state.orders.forEach((order) => {
        if (action.payload) {
          newSelection[order.id] = true;
        } else {
          delete newSelection[order.id];
        }
      });
      return { ...state, rowSelection: newSelection };
    }
    default:
      return state;
  }
};

export const useOrderState = (): OrderContextType => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const debouncedSearch = useDebounce(state.search, 300);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchOrders = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const response = await fetchPaginatedOrders(
          state.page,
          state.pageSize,
          state.sorting?.id,
          state.sorting?.direction,
          debouncedSearch,
          state.filters,
          signal
        );

        dispatch({
          type: "SET_DATA",
          payload: {
            orders: response.data,
            total: response.meta.total,
            totalPages: response.meta.totalPages,
            stats: response.stats,
          },
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Request aborted (stale)");
          return;
        }

        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred while fetching orders.");
        }
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchOrders();

    return () => {
      abortController.abort();
    };
  }, [
    state.page,
    state.pageSize,
    state.sorting,
    debouncedSearch,
    state.filters,
  ]);

  return {
    ...state,
    dispatch,
    isFiltered:
      Object.values(state.filters).some((values) => values.length > 0) ||
      state.search.length > 0,
  };
};
