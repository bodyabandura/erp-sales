import { useContext } from "react";
import { RepositoryContext } from "../contexts/RepositoryContext";
import { IProductRepository } from "../../domain/repositories/IProductRepository";

export const useProductRepository = (): IProductRepository => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error(
      "useProductRepository must be used within a RepositoryProvider"
    );
  }
  return context.productRepository;
};
