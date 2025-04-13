import { Warehouse } from "../entities/Warehouse";
import { IRepository } from "./IRepository";

export interface IWarehouseRepository extends IRepository<Warehouse> {
  findByName(name: string): Promise<Warehouse[]>;
  findByLocation(location: string): Promise<Warehouse[]>;
  findActive(): Promise<Warehouse[]>;
}
