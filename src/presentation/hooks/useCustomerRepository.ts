import { useContext } from "react";
import { RepositoryContext } from "../contexts/RepositoryContext";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";

export const useCustomerRepository = (): ICustomerRepository => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error(
      "useCustomerRepository must be used within a RepositoryProvider"
    );
  }
  return context.customerRepository;
};
