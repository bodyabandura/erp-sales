import { Money } from "../value-objects/Money";

export class Customer {
  private readonly _id: string;
  private _code: string;
  private _name: string;
  private _address: string;
  private _phone: string;
  private _creditLimit: Money;
  private _balance: Money;

  constructor(
    id: string,
    code: string,
    name: string,
    address: string = "",
    phone: string = "",
    creditLimit: Money = new Money(0)
  ) {
    this._id = id;
    this._code = code;
    this._name = name;
    this._address = address;
    this._phone = phone;
    this._creditLimit = creditLimit;
    this._balance = new Money(0);
  }

  // Getters
  public get id(): string {
    return this._id;
  }

  public get code(): string {
    return this._code;
  }

  public get name(): string {
    return this._name;
  }

  public get address(): string {
    return this._address;
  }

  public get phone(): string {
    return this._phone;
  }

  public get creditLimit(): Money {
    return this._creditLimit;
  }

  public get balance(): Money {
    return this._balance;
  }

  // Setters with validation
  public setCode(code: string): void {
    if (!code.trim()) {
      throw new Error("Customer code cannot be empty");
    }
    this._code = code;
  }

  public setName(name: string): void {
    if (!name.trim()) {
      throw new Error("Customer name cannot be empty");
    }
    this._name = name;
  }

  public setAddress(address: string): void {
    this._address = address;
  }

  public setPhone(phone: string): void {
    this._phone = phone;
  }

  public setCreditLimit(limit: Money): void {
    if (limit.isNegative()) {
      throw new Error("Credit limit cannot be negative");
    }
    this._creditLimit = limit;
  }

  // Business logic
  public canPlaceOrder(orderAmount: Money): boolean {
    // Завжди дозволяємо розміщення замовлення, незалежно від суми
    return true;
  }

  public addToBalance(amount: Money): void {
    this._balance = this._balance.add(amount);
  }

  public subtractFromBalance(amount: Money): void {
    if (amount.isGreaterThan(this._balance)) {
      throw new Error("Cannot subtract more than current balance");
    }
    this._balance = this._balance.subtract(amount);
  }

  // Value comparison
  public equals(other: Customer): boolean {
    return this._id === other._id;
  }
}
