import { Product } from "../entities/Product";
import { IRepository } from "./IRepository";
import { Money } from "../value-objects/Money";

export interface IProductRepository extends IRepository<Product> {
  findByName(name: string): Promise<Product[]>;
  findByPriceRange(min: Money, max: Money): Promise<Product[]>;
  findByUnit(unit: string): Promise<Product[]>;
}
