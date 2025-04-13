import { IRepository } from "../../../domain/repositories/IRepository";
import { DatabaseService } from "../../services/DatabaseService";

export abstract class SQLBaseRepository<T, Row> implements IRepository<T> {
  constructor(
    protected readonly db: DatabaseService,
    protected readonly tableName: string
  ) {}

  async getById(id: string): Promise<T | null> {
    const [result] = await this.db.query<Row>(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return result ? this.mapToDomainEntity(result) : null;
  }

  async getAll(): Promise<T[]> {
    const results = await this.db.query<Row>(`SELECT * FROM ${this.tableName}`);
    return results.map((row) => this.mapToDomainEntity(row));
  }

  async create(entity: T): Promise<void> {
    const data = this.mapToDatabase(entity);
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");

    await this.db.query(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
      Object.values(data)
    );
  }

  async update(entity: T): Promise<void> {
    const data = this.mapToDatabase(entity);
    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");

    await this.db.query(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
      [...Object.values(data), data.id]
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  protected abstract mapToDomainEntity(row: Row): T;
  protected abstract mapToDatabase(entity: T): Record<string, any>;
}
