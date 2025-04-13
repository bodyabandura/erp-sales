import { useContext } from "react";
import { RepositoryContext } from "../contexts/RepositoryContext";
import { IOrderRepository } from "../../domain/repositories/IOrderRepository";

export const useOrderRepository = (): IOrderRepository => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error(
      "useOrderRepository must be used within a RepositoryProvider"
    );
  }
  return context.orderRepository;
};
