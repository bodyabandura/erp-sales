import { Product } from "../../domain/entities/Product";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Money } from "../../domain/value-objects/Money";
import { DatabaseService } from "../services/DatabaseService";

export class SQLProductRepository implements IProductRepository {
  constructor(private readonly db: DatabaseService) {}

  async getById(id: string): Promise<Product | null> {
    const result = await this.db.query("SELECT * FROM products WHERE id = ?", [
      id,
    ]);

    if (!result.length) {
      return null;
    }

    return this.mapToDomainEntity(result[0]);
  }

  async getAll(): Promise<Product[]> {
    const results = await this.db.query("SELECT * FROM products");
    return results.map(this.mapToDomainEntity.bind(this));
  }

  async create(product: Product): Promise<void> {
    await this.db.query(
      "INSERT INTO products (id, name, price, unit) VALUES (?, ?, ?, ?)",
      [product.id, product.name, product.price.amount, product.unit]
    );
  }

  async update(product: Product): Promise<void> {
    await this.db.query(
      "UPDATE products SET name = ?, price = ?, unit = ? WHERE id = ?",
      [product.name, product.price.amount, product.unit, product.id]
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.query("DELETE FROM products WHERE id = ?", [id]);
  }

  async findByName(name: string): Promise<Product[]> {
    const results = await this.db.query(
      "SELECT * FROM products WHERE name LIKE ?",
      [`%${name}%`]
    );
    return results.map(this.mapToDomainEntity.bind(this));
  }

  async findByPriceRange(min: Money, max: Money): Promise<Product[]> {
    const results = await this.db.query(
      "SELECT * FROM products WHERE price BETWEEN ? AND ?",
      [min.amount, max.amount]
    );
    return results.map(this.mapToDomainEntity.bind(this));
  }

  async findByUnit(unit: string): Promise<Product[]> {
    const results = await this.db.query(
      "SELECT * FROM products WHERE unit = ?",
      [unit]
    );
    return results.map(this.mapToDomainEntity.bind(this));
  }

  private mapToDomainEntity(row: any): Product {
    return new Product(row.id, row.name, new Money(row.price), row.unit);
  }
}
