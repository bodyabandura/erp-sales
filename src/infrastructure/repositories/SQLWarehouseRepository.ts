import { Warehouse } from "../../domain/entities/Warehouse";
import { IWarehouseRepository } from "../../domain/repositories/IWarehouseRepository";
import { DatabaseService } from "../services/DatabaseService";
import { SQLBaseRepository } from "./base/SQLBaseRepository";
import { WarehouseQueries } from "./sql/warehouse.queries";

interface WarehouseRow {
  id: string;
  name: string;
  location: string;
  is_active: boolean;
}

export class SQLWarehouseRepository
  extends SQLBaseRepository<Warehouse, WarehouseRow>
  implements IWarehouseRepository
{
  constructor(db: DatabaseService) {
    super(db, "warehouses");
  }

  protected mapToDomainEntity(row: WarehouseRow): Warehouse {
    return new Warehouse(row.id, row.name, row.location, row.is_active);
  }

  protected mapToDatabase(entity: Warehouse): Record<string, any> {
    return {
      id: entity.id,
      name: entity.name,
      location: entity.location,
      is_active: entity.isActive,
    };
  }

  async findByName(name: string): Promise<Warehouse[]> {
    const results = await this.db.query<WarehouseRow>(
      WarehouseQueries.findByName,
      [`%${name}%`]
    );
    return results.map((row) => this.mapToDomainEntity(row));
  }

  async findByLocation(location: string): Promise<Warehouse[]> {
    const results = await this.db.query<WarehouseRow>(
      WarehouseQueries.findByLocation,
      [`%${location}%`]
    );
    return results.map((row) => this.mapToDomainEntity(row));
  }

  async findActive(): Promise<Warehouse[]> {
    const results = await this.db.query<WarehouseRow>(
      WarehouseQueries.findActive
    );
    return results.map((row) => this.mapToDomainEntity(row));
  }
}
