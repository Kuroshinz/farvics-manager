export class BusinessDate {
  constructor(public readonly date: Date) {
    // Strip time for business dates
    this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  equals(other: BusinessDate): boolean {
    return this.date.getTime() === other.date.getTime();
  }
  isBefore(other: BusinessDate): boolean {
    return this.date.getTime() < other.date.getTime();
  }
  isAfter(other: BusinessDate): boolean {
    return this.date.getTime() > other.date.getTime();
  }
}

export class AccountingPeriod {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly startDate: BusinessDate,
    public readonly endDate: BusinessDate,
    public readonly isClosed: boolean = false
  ) {
    if (endDate.isBefore(startDate)) throw new Error('End date must be after start date');
  }

  contains(date: BusinessDate): boolean {
    return !date.isBefore(this.startDate) && !date.isAfter(this.endDate);
  }
}

export class ClosingPeriod {
  constructor(
    public readonly period: AccountingPeriod,
    public readonly closedAt: Date,
    public readonly closedBy: string
  ) {
    if (!period.isClosed) throw new Error('Period must be marked as closed');
  }
}
