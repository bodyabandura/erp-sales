import { Order } from "../entities/Order";
import { IRepository } from "./IRepository";
import { Customer } from "../entities/Customer";
import { DateRange } from "../value-objects/DateRange";

export interface IOrderRepository extends IRepository<Order> {
  findByCustomer(customer: Customer): Promise<Order[]>;
  findByDateRange(dateRange: DateRange): Promise<Order[]>;
  findUnpaidOrders(): Promise<Order[]>;
  getTotalSalesInRange(dateRange: DateRange): Promise<number>;
}
