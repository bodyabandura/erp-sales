import { useContext } from "react";
import { RepositoryContext } from "../contexts/RepositoryContext";
import { IWarehouseRepository } from "../../domain/repositories/IWarehouseRepository";

export const useWarehouseRepository = (): IWarehouseRepository => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error(
      "useWarehouseRepository must be used within a RepositoryProvider"
    );
  }
  return context.warehouseRepository;
};
