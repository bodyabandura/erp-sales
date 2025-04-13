import React, { createContext, ReactNode } from "react";
import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { IWarehouseRepository } from "../../domain/repositories/IWarehouseRepository";
import { ISalespersonRepository } from "../../domain/repositories/ISalespersonRepository";

interface RepositoryContextType {
  orderRepository: IOrderRepository;
  customerRepository: ICustomerRepository;
  productRepository: IProductRepository;
  warehouseRepository: IWarehouseRepository;
  salespersonRepository: ISalespersonRepository;
}

export const RepositoryContext = createContext<RepositoryContextType | null>(
  null
);

interface RepositoryProviderProps {
  children: ReactNode;
  repositories: RepositoryContextType;
}

export const RepositoryProvider: React.FC<RepositoryProviderProps> = ({
  children,
  repositories,
}) => {
  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
};
