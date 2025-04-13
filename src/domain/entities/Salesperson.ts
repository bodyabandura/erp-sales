import { Money } from "../value-objects/Money";

export class Salesperson {
  private readonly _id: string;
  private _name: string;
  private _code: string;
  private _commission: number = 0;
  private _isActive: boolean = true;
  private _totalSales: Money = new Money(0);

  constructor(
    id: string,
    name: string,
    code: string,
    commission: number = 0,
    isActive: boolean = true
  ) {
    this._id = id;
    this._name = name;
    this._code = code;
    this.setCommission(commission);
    this._isActive = isActive;
    this._totalSales = new Money(0);
  }

  // Getters
  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get code(): string {
    return this._code;
  }

  public get commission(): number {
    return this._commission;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public get totalSales(): Money {
    return this._totalSales;
  }

  // Setters with validation
  public setName(name: string): void {
    if (!name.trim()) {
      throw new Error("Salesperson name cannot be empty");
    }
    this._name = name;
  }

  public setCode(code: string): void {
    if (!code.trim()) {
      throw new Error("Salesperson code cannot be empty");
    }
    this._code = code;
  }

  public setCommission(commission: number): void {
    if (commission < 0 || commission > 100) {
      throw new Error("Commission must be between 0 and 100 percent");
    }
    this._commission = commission;
  }

  public activate(): void {
    this._isActive = true;
  }

  public deactivate(): void {
    this._isActive = false;
  }

  // Business logic
  public addSale(amount: Money): void {
    this._totalSales = this._totalSales.add(amount);
  }

  public calculateCommissionAmount(saleAmount: Money): Money {
    return saleAmount.multiply(this._commission / 100);
  }

  public canMakeSales(): boolean {
    return this._isActive;
  }

  // Value comparison
  public equals(other: Salesperson): boolean {
    return this._id === other._id;
  }
}
