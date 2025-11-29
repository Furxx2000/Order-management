import { createContext, useContext } from "react";
import type { Order, OrderStats } from "@/lib/definitions";

export interface State {
  orders: Order[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  sorting: { id: string; direction: "asc" | "desc" } | null;
  totalCount: number;
  pageCount: number;
  stats: OrderStats;
  search: string;
  filters: Record<string, string[]>;
  rowSelection: Record<string, boolean>;
}

export type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "SET_DATA";
      payload: {
        orders: Order[];
        total: number;
        totalPages: number;
        stats: OrderStats;
      };
    }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | {
      type: "SET_SORTING";
      payload: { id: string; direction: "asc" | "desc" } | null;
    }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_FILTER"; payload: { key: string; value: string[] } }
  | { type: "RESET_FILTERS" }
  | {
      type: "UPDATE_ORDER";
      payload: { orderId: string; updates: Partial<Order> };
    }
  | { type: "TOGGLE_ROW"; payload: { orderId: string; value: boolean } }
  | { type: "TOGGLE_ALL_ROWS"; payload: boolean };

export interface OrderContextType extends State {
  dispatch: React.Dispatch<Action>;
  isFiltered: boolean;
}

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined
);

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};
