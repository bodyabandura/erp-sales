export class DateRange {
  private readonly _start: Date;
  private readonly _end: Date;

  constructor(start: Date, end: Date) {
    if (end < start) {
      throw new Error("End date cannot be before start date");
    }
    this._start = start;
    this._end = end;
  }

  public get start(): Date {
    return new Date(this._start);
  }

  public get end(): Date {
    return new Date(this._end);
  }

  public includes(date: Date): boolean {
    return date >= this._start && date <= this._end;
  }

  public overlaps(other: DateRange): boolean {
    return this._start <= other._end && this._end >= other._start;
  }

  public getDurationInDays(): number {
    const diffTime = Math.abs(this._end.getTime() - this._start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  public equals(other: DateRange): boolean {
    return (
      this._start.getTime() === other._start.getTime() &&
      this._end.getTime() === other._end.getTime()
    );
  }

  public toString(): string {
    return `${this._start.toISOString()} - ${this._end.toISOString()}`;
  }

  // Factory methods
  public static today(): DateRange {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new DateRange(today, tomorrow);
  }

  public static thisMonth(): DateRange {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
    return new DateRange(start, end);
  }
}
