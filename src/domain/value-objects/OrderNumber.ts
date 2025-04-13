export class OrderNumber {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error("Invalid order number format");
    }
    this._value = value;
  }

  private isValid(value: string): boolean {
    // Order number format validation
    // Can be customized based on business rules
    return value.trim().length > 0;
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: OrderNumber): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }

  // Factory method for generating new order numbers
  public static generate(
    prefix: string = "",
    date: Date = new Date()
  ): OrderNumber {
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const value = `${prefix}${timestamp}${random}`;
    return new OrderNumber(value);
  }
}
