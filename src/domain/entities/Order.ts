import { Money } from "../value-objects/Money";
import { OrderNumber } from "../value-objects/OrderNumber";
import { TaxCalculation } from "../value-objects/TaxCalculation";
import { Customer } from "./Customer";
import { OrderItem } from "./OrderItem";
import { Salesperson } from "./Salesperson";

export type TaxType = "none" | "external" | "internal";

export class Order {
  private _orderNumber: OrderNumber;
  private _orderDate: Date;
  private _customer: Customer;
  private _items: OrderItem[] = [];
  private _salesperson: Salesperson;
  private _installationPerson: string;
  private _taxType: TaxType;
  private _discount: Money;
  private _paidAmount: Money;
  private _notes: string;
  private _isPrinted: boolean;

  constructor(
    orderNumber: OrderNumber,
    orderDate: Date,
    customer: Customer,
    salesperson: Salesperson
  ) {
    this._orderNumber = orderNumber;
    this._orderDate = orderDate;
    this._customer = customer;
    this._salesperson = salesperson;
    this._discount = new Money(0);
    this._paidAmount = new Money(0);
    this._taxType = "none";
    this._isPrinted = false;
    this._notes = "";
    this._installationPerson = "";
  }

  // Domain methods
  public addItem(item: OrderItem): void {
    this._items.push(item);
  }

  public removeItem(index: number): void {
    if (index >= 0 && index < this._items.length) {
      this._items.splice(index, 1);
    }
  }

  public calculateSubtotal(): Money {
    return this._items.reduce(
      (sum, item) => sum.add(item.getSubtotal()),
      new Money(0)
    );
  }

  public calculateTax(): Money {
    const subtotal = this.calculateSubtotal();
    const discountedAmount = subtotal.subtract(this._discount);
    return TaxCalculation.calculate(discountedAmount, this._taxType);
  }

  public calculateTotal(): Money {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax();
    return subtotal
      .subtract(this._discount)
      .add(this._taxType === "external" ? tax : new Money(0));
  }

  public calculateRemainingAmount(): Money {
    return this.calculateTotal().subtract(this._paidAmount);
  }

  // Getters
  public get orderNumber(): string {
    return this._orderNumber.value;
  }

  public get orderDate(): Date {
    return this._orderDate;
  }

  public get customer(): Customer {
    return this._customer;
  }

  public get items(): ReadonlyArray<OrderItem> {
    return this._items;
  }

  public get salesperson(): Salesperson {
    return this._salesperson;
  }

  // Additional getters for persistence
  public get discount(): Money {
    return this._discount;
  }

  public get taxType(): TaxType {
    return this._taxType;
  }

  public get notes(): string {
    return this._notes;
  }

  public get isPrinted(): boolean {
    return this._isPrinted;
  }

  // Setters with validation
  public setDiscount(amount: Money): void {
    if (amount.isNegative()) {
      throw new Error("Discount cannot be negative");
    }
    this._discount = amount;
  }

  public setPaidAmount(amount: Money): void {
    if (amount.isNegative()) {
      throw new Error("Paid amount cannot be negative");
    }
    this._paidAmount = amount;
  }

  public setTaxType(type: TaxType): void {
    this._taxType = type;
  }

  public setNotes(notes: string): void {
    this._notes = notes;
  }

  public markAsPrinted(): void {
    this._isPrinted = true;
  }
}
