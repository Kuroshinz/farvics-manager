import { Money } from '../Money';
import { AccountNumber, TransactionNumber } from '../Identifiers';
import { BusinessDate } from '../Calendar';
import { EntryType } from '../Ledger';

export enum JournalStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
  ARCHIVED = 'ARCHIVED'
}

export class JournalEntry {
  constructor(
    public readonly id: string,
    public readonly accountId: AccountNumber,
    public readonly amount: Money,
    public readonly type: EntryType
  ) {}

  invert(): JournalEntry {
    return new JournalEntry(
      `rev-${this.id}`,
      this.accountId,
      this.amount,
      this.type === EntryType.DEBIT ? EntryType.CREDIT : EntryType.DEBIT
    );
  }
}

export class Journal {
  private _status: JournalStatus;
  
  constructor(
    public readonly id: TransactionNumber,
    public readonly date: BusinessDate,
    public readonly entries: ReadonlyArray<JournalEntry>,
    public readonly description: string,
    status: JournalStatus = JournalStatus.DRAFT,
    public readonly originalJournalId?: TransactionNumber
  ) {
    this._status = status;
    this.enforceDoubleEntry();
  }

  get status(): JournalStatus {
    return this._status;
  }

  private enforceDoubleEntry(): void {
    if (this.entries.length === 0) return;
    
    const currency = this.entries[0].amount.currency;
    let balance = Money.zero(currency);

    for (const entry of this.entries) {
      if (!entry.amount.currency.equals(currency)) {
        throw new Error('Journal contains mixed currencies. Must be single currency per journal.');
      }
      if (entry.type === EntryType.DEBIT) {
        balance = balance.add(entry.amount);
      } else {
        balance = balance.subtract(entry.amount);
      }
    }

    if (!balance.isZero()) {
      throw new Error(`Double entry validation failed. Journal is unbalanced by ${balance.format()}`);
    }
  }

  markPosted(): void {
    if (this._status !== JournalStatus.DRAFT) throw new Error('Only DRAFT journals can be posted');
    this._status = JournalStatus.POSTED;
  }

  markReversed(): void {
    if (this._status !== JournalStatus.POSTED) throw new Error('Only POSTED journals can be reversed');
    this._status = JournalStatus.REVERSED;
  }
}
