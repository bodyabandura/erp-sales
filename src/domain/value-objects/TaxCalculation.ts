import { Money } from "./Money";
import { TaxType } from "../entities/Order";

export class TaxCalculation {
  private static readonly TAX_RATE = 0.05; // 5% tax rate

  public static calculate(amount: Money, taxType: TaxType): Money {
    switch (taxType) {
      case "external":
        return amount.multiply(this.TAX_RATE);
      case "internal":
        return amount.subtract(amount.divide(1 + this.TAX_RATE));
      case "none":
        return new Money(0);
      default:
        throw new Error(`Unknown tax type: ${taxType}`);
    }
  }

  public static getTaxRate(): number {
    return this.TAX_RATE;
  }

  // Private constructor to prevent instantiation
  private constructor() {}
}
