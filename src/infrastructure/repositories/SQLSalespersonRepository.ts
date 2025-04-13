import { Salesperson } from "../../domain/entities/Salesperson";
import { ISalespersonRepository } from "../../domain/repositories/ISalespersonRepository";
import { Money } from "../../domain/value-objects/Money";
import { DatabaseService } from "../services/DatabaseService";

export class SQLSalespersonRepository implements ISalespersonRepository {
  constructor(private readonly db: DatabaseService) {}

  async getById(id: string): Promise<Salesperson | null> {
    const result = await this.db.query(
      `SELECT s.*, COALESCE(SUM(o.total_amount), 0) as total_sales 
       FROM salespersons s 
       LEFT JOIN orders o ON s.id = o.salesperson_id 
       WHERE s.id = ?
       GROUP BY s.id`,
      [id]
    );

    if (!result.length) {
      return null;
    }

    return this.mapToDomainEntity(result[0]);
  }

  async getAll(): Promise<Salesperson[]> {
    const results = await this.db.query(
      `SELECT s.*, COALESCE(SUM(o.total_amount), 0) as total_sales 
       FROM salespersons s 
       LEFT JOIN orders o ON s.id = o.salesperson_id 
       GROUP BY s.id`
    );
    return results.map(this.mapToDomainEntity.bind(this));
  }

  async create(salesperson: Salesperson): Promise<void> {
    await this.db.query(
      "INSERT INTO salespersons (id, code, name, commission, is_active) VALUES (?, ?, ?, ?, ?)",
      [
        salesperson.id,
        salesperson.code,
        salesperson.name,
        salesperson.commission,
        salesperson.isActive,
      ]
    );
  }

  async update(salesperson: Salesperson): Promise<void> {
    await this.db.query(
      "UPDATE salespersons SET code = ?, name = ?, commission = ?, is_active = ? WHERE id = ?",
      [
        salesperson.code,
        salesperson.name,
        salesperson.commission,
        salesperson.isActive,
        salesperson.id,
      ]
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.query("DELETE FROM salespersons WHERE id = ?", [id]);
  }

  async findByName(name: string): Promise<Salesperson[]> {
    const results = await this.db.query(
      `SELECT s.*, COALESCE(SUM(o.total_amount), 0) as total_sales 
       FROM salespersons s 
       LEFT JOIN orders o ON s.id = o.salesperson_id 
       WHERE s.name LIKE ?
       GROUP BY s.id`,
      [`%${name}%`]
    );
    return results.map(this.mapToDomainEntity.bind(this));
  }

  async findByCode(code: string): Promise<Salesperson | null> {
    const result = await this.db.query(
      `SELECT s.*, COALESCE(SUM(o.total_amount), 0) as total_sales 
       FROM salespersons s 
       LEFT JOIN orders o ON s.id = o.salesperson_id 
       WHERE s.code = ?
       GROUP BY s.id`,
      [code]
    );

    if (!result.length) {
      return null;
    }

    return this.mapToDomainEntity(result[0]);
  }

  async findActive(): Promise<Salesperson[]> {
    const results = await this.db.query(
      `SELECT s.*, COALESCE(SUM(o.total_amount), 0) as total_sales 
       FROM salespersons s 
       LEFT JOIN orders o ON s.id = o.salesperson_id 
       WHERE s.is_active = true
       GROUP BY s.id`
    );
    return results.map(this.mapToDomainEntity.bind(this));
  }

  async findByTotalSalesGreaterThan(amount: Money): Promise<Salesperson[]> {
    const results = await this.db.query(
      `SELECT s.*, COALESCE(SUM(o.total_amount), 0) as total_sales 
       FROM salespersons s 
       LEFT JOIN orders o ON s.id = o.salesperson_id 
       GROUP BY s.id
       HAVING total_sales > ?`,
      [amount.amount]
    );
    return results.map(this.mapToDomainEntity.bind(this));
  }

  private mapToDomainEntity(row: any): Salesperson {
    const salesperson = new Salesperson(
      row.id,
      row.name,
      row.code,
      row.commission,
      row.is_active
    );

    if (row.total_sales) {
      salesperson.addSale(new Money(row.total_sales));
    }

    return salesperson;
  }
}
