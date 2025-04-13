export class Money {
  private readonly _amount: number;

  constructor(amount: number) {
    this._amount = Math.round(amount * 100) / 100; // Round to 2 decimal places
  }

  public add(other: Money): Money {
    return new Money(this._amount + other._amount);
  }

  public subtract(other: Money): Money {
    return new Money(this._amount - other._amount);
  }

  public multiply(factor: number): Money {
    return new Money(this._amount * factor);
  }

  public divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error("Cannot divide by zero");
    }
    return new Money(this._amount / divisor);
  }

  public isNegative(): boolean {
    return this._amount < 0;
  }

  public isZero(): boolean {
    return this._amount === 0;
  }

  public isGreaterThan(other: Money): boolean {
    return this._amount > other._amount;
  }

  public isLessThan(other: Money): boolean {
    return this._amount < other._amount;
  }

  public equals(other: Money): boolean {
    return this._amount === other._amount;
  }

  public get amount(): number {
    return this._amount;
  }

  public toString(): string {
    return this._amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
