import { Money } from "../value-objects/Money";
import { Product } from "./Product";
import { Warehouse } from "./Warehouse";

export class OrderItem {
  private readonly _product: Product;
  private _quantity: number = 1;
  private _warehouse: Warehouse;
  private _specifications: string = "";

  constructor(
    product: Product,
    quantity: number,
    warehouse: Warehouse,
    specifications: string = ""
  ) {
    this._product = product;
    this.setQuantity(quantity);
    this._warehouse = warehouse;
    this._specifications = specifications;
  }

  public getSubtotal(): Money {
    return this._product.price.multiply(this._quantity);
  }

  public setQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }
    this._quantity = quantity;
  }

  public setWarehouse(warehouse: Warehouse): void {
    this._warehouse = warehouse;
  }

  public setSpecifications(specifications: string): void {
    this._specifications = specifications;
  }

  // Getters
  public get product(): Product {
    return this._product;
  }

  public get quantity(): number {
    return this._quantity;
  }

  public get warehouse(): Warehouse {
    return this._warehouse;
  }

  public get specifications(): string {
    return this._specifications;
  }

  // Value comparison
  public equals(other: OrderItem): boolean {
    return (
      this._product.equals(other._product) &&
      this._quantity === other._quantity &&
      this._warehouse.equals(other._warehouse) &&
      this._specifications === other._specifications
    );
  }
}
