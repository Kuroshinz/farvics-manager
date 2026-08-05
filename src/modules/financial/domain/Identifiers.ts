export abstract class FinancialIdentifier {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') throw new Error('Identifier cannot be empty');
  }
  equals(other: FinancialIdentifier): boolean {
    return this.value === other.value && this.constructor.name === other.constructor.name;
  }
  toString(): string { return this.value; }
}

export class AccountNumber extends FinancialIdentifier {}
export class TransactionNumber extends FinancialIdentifier {}
export class BudgetNumber extends FinancialIdentifier {}
export class GoalNumber extends FinancialIdentifier {}
