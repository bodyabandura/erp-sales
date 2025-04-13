export class Warehouse {
  private readonly _id: string;
  private _name: string;
  private _location: string;
  private _isActive: boolean;

  constructor(
    id: string,
    name: string,
    location: string,
    isActive: boolean = true
  ) {
    this._id = id;
    this._name = name;
    this._location = location;
    this._isActive = isActive;
  }

  // Getters
  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get location(): string {
    return this._location;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  // Setters with validation
  public setName(name: string): void {
    if (!name.trim()) {
      throw new Error("Warehouse name cannot be empty");
    }
    this._name = name;
  }

  public setLocation(location: string): void {
    if (!location.trim()) {
      throw new Error("Warehouse location cannot be empty");
    }
    this._location = location;
  }

  public activate(): void {
    this._isActive = true;
  }

  public deactivate(): void {
    this._isActive = false;
  }

  // Value comparison
  public equals(other: Warehouse): boolean {
    return this._id === other._id;
  }

  // Business logic
  public canAcceptOrders(): boolean {
    return this._isActive;
  }
}
