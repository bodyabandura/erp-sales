import { Salesperson } from "../entities/Salesperson";
import { IRepository } from "./IRepository";
import { Money } from "../value-objects/Money";

export interface ISalespersonRepository extends IRepository<Salesperson> {
  findByName(name: string): Promise<Salesperson[]>;
  findByCode(code: string): Promise<Salesperson | null>;
  findActive(): Promise<Salesperson[]>;
  findByTotalSalesGreaterThan(amount: Money): Promise<Salesperson[]>;
}
