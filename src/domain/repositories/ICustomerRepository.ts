import { Customer } from "../entities/Customer";
import { IRepository } from "./IRepository";
import { Money } from "../value-objects/Money";

export interface ICustomerRepository extends IRepository<Customer> {
  findByCode(code: string): Promise<Customer | null>;
  findByName(name: string): Promise<Customer[]>;
  findByBalanceGreaterThan(amount: Money): Promise<Customer[]>;
  findByOverduePayments(): Promise<Customer[]>;
}
