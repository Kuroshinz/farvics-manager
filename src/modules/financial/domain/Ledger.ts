import { Money } from './Money';
import { AccountNumber, TransactionNumber } from './Identifiers';
import { BusinessDate } from './Calendar';

export enum EntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT'
}

export class LedgerEntry {
  constructor(
    public readonly accountId: AccountNumber,
    public readonly amount: Money,
    public readonly type: EntryType
  ) {}
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
  REFUND = 'REFUND'
}

export class LedgerTransaction {
  constructor(
    public readonly id: TransactionNumber,
    public readonly type: TransactionType,
    public readonly date: BusinessDate,
    public readonly entries: LedgerEntry[]
  ) {
    this.validateBalance();
  }

  private validateBalance(): void {
    if (this.entries.length === 0) return;
    const currency = this.entries[0].amount.currency;
    let balance = Money.zero(currency);

    for (const entry of this.entries) {
      if (entry.type === EntryType.DEBIT) {
        balance = balance.add(entry.amount);
      } else {
        balance = balance.subtract(entry.amount);
      }
    }

    if (!balance.isZero()) {
      throw new Error('Ledger transaction entries must balance to zero');
    }
  }
}

export class BalanceEngine {
  static projectBalance(entries: LedgerEntry[], targetAccount: AccountNumber): Money {
    if (entries.length === 0) throw new Error('No entries provided');
    
    const currency = entries[0].amount.currency;
    let balance = Money.zero(currency);

    for (const entry of entries) {
      if (!entry.accountId.equals(targetAccount)) continue;
      
      // Typical asset account balance calculation: Debit increases, Credit decreases
      if (entry.type === EntryType.DEBIT) {
        balance = balance.add(entry.amount);
      } else {
        balance = balance.subtract(entry.amount);
      }
    }
    
    return balance;
  }
}
