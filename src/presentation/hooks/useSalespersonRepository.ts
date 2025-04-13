import { useContext } from "react";
import { RepositoryContext } from "../contexts/RepositoryContext";
import { ISalespersonRepository } from "../../domain/repositories/ISalespersonRepository";

export const useSalespersonRepository = (): ISalespersonRepository => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error(
      "useSalespersonRepository must be used within a RepositoryProvider"
    );
  }
  return context.salespersonRepository;
};
