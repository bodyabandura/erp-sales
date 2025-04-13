import { Money } from "../value-objects/Money";

export class Product {
  private readonly _id: string;
  private _name: string;
  private _price: Money;
  private _unit: string;

  constructor(id: string, name: string, price: Money, unit: string) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._unit = unit;
  }

  // Getters
  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get price(): Money {
    return this._price;
  }

  public get unit(): string {
    return this._unit;
  }

  // Setters with validation
  public setName(name: string): void {
    if (!name.trim()) {
      throw new Error("Product name cannot be empty");
    }
    this._name = name;
  }

  public setPrice(price: Money): void {
    if (price.isNegative()) {
      throw new Error("Product price cannot be negative");
    }
    this._price = price;
  }

  public setUnit(unit: string): void {
    if (!unit.trim()) {
      throw new Error("Product unit cannot be empty");
    }
    this._unit = unit;
  }

  // Value comparison
  public equals(other: Product): boolean {
    return this._id === other._id;
  }

  // Business logic
  public isPriceInRange(min: Money, max: Money): boolean {
    return !this._price.isLessThan(min) && !this._price.isGreaterThan(max);
  }
}
