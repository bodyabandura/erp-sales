import { Customer } from "../../domain/entities/Customer";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { Money } from "../../domain/value-objects/Money";
import { DatabaseService } from "../services/DatabaseService";
import { CustomerQueries } from "./sql/customer.queries";
import { CustomerRow } from "./types/sql-results";

export class SQLCustomerRepository implements ICustomerRepository {
  constructor(private readonly db: DatabaseService) {}

  async getById(id: string): Promise<Customer | null> {
    const [result] = await this.db.query<CustomerRow>(CustomerQueries.getById, [
      id,
    ]);
    return result ? this.mapToDomainEntity(result) : null;
  }

  async getAll(): Promise<Customer[]> {
    const results = await this.db.query<CustomerRow>(CustomerQueries.getAll);
    return results.map(this.mapToDomainEntity.bind(this));
  }

  async create(customer: Customer): Promise<void> {
    await this.db.query(CustomerQueries.create, [
      customer.id,
      customer.code,
      customer.name,
      customer.address,
      customer.phone,
      customer.creditLimit.amount,
    ]);
  }

  async update(customer: Customer): Promise<void> {
    await this.db.query(CustomerQueries.update, [
      customer.code,
      customer.name,
      customer.address,
      customer.phone,
      customer.creditLimit.amount,
      customer.id,
    ]);
  }

  async delete(id: string): Promise<void> {
    await this.db.query(CustomerQueries.delete, [id]);
  }

  async findByCode(code: string): Promise<Customer | null> {
    const [result] = await this.db.query<CustomerRow>(
      CustomerQueries.findByCode,
      [code]
    );
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findByName(name: string): Promise<Customer[]> {
    const results = await this.db.query<CustomerRow>(
      CustomerQueries.findByName,
      [`%${name}%`]
    );
    return results.map(this.mapToDomainEntity.bind(this));
  }

  async findByBalanceGreaterThan(amount: Money): Promise<Customer[]> {
    const results = await this.db.query<CustomerRow>(
      CustomerQueries.findByBalanceGreaterThan,
      [amount.amount]
    );
    return results.map(this.mapToDomainEntity.bind(this));
  }

  async findByOverduePayments(): Promise<Customer[]> {
    const results = await this.db.query<CustomerRow>(
      CustomerQueries.findByOverduePayments
    );
    return results.map(this.mapToDomainEntity.bind(this));
  }

  private mapToDomainEntity(row: CustomerRow): Customer {
    return new Customer(
      row.id,
      row.code,
      row.name,
      row.address,
      row.phone,
      new Money(row.credit_limit)
    );
  }
}
