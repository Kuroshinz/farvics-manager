import { Money } from '../Money';
import { BudgetNumber, AccountNumber } from '../Identifiers';
import { AccountingPeriod } from '../Calendar';

export class Budget {
  constructor(
    public readonly id: BudgetNumber,
    public readonly name: string,
    public readonly period: AccountingPeriod,
    public readonly limit: Money,
    private _consumed: Money,
    private _forecast: Money
  ) {
    if (!limit.currency.equals(_consumed.currency)) throw new Error('Currency mismatch');
  }

  get consumed(): Money { return this._consumed; }
  get forecast(): Money { return this._forecast; }

  consume(amount: Money): void {
    if (!this.limit.currency.equals(amount.currency)) throw new Error('Currency mismatch on consumption');
    this._consumed = this._consumed.add(amount);
  }

  updateForecast(projectedAmount: Money): void {
    this._forecast = projectedAmount;
  }

  getRemaining(): Money {
    return this.limit.subtract(this._consumed);
  }

  isOverspent(): boolean {
    return this._consumed.isGreaterThan(this.limit);
  }

  willOverspend(): boolean {
    const projectedTotal = this._consumed.add(this._forecast);
    return projectedTotal.isGreaterThan(this.limit);
  }
}
