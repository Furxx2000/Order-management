import { type ReactNode } from "react";
import { OrderContext } from "./useOrderContext";
import { useOrderState } from "@/hooks/useOrderState/useOrderState";

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const orderState = useOrderState();

  return (
    <OrderContext.Provider value={orderState}>{children}</OrderContext.Provider>
  );
};
