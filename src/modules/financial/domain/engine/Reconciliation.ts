import { JournalEntry } from './JournalEngine';
import { Money } from '../Money';
import { BusinessDate } from '../Calendar';

export enum ReconciliationState {
  PENDING = 'PENDING',
  MATCHED = 'MATCHED',
  MANUAL_MATCH = 'MANUAL_MATCH',
  IGNORED = 'IGNORED'
}

export class BankStatementLine {
  constructor(
    public readonly id: string,
    public readonly date: BusinessDate,
    public readonly amount: Money,
    public readonly reference: string
  ) {}
}

export class ReconciliationRecord {
  constructor(
    public readonly id: string,
    public readonly statementLine: BankStatementLine,
    public readonly ledgerEntry: JournalEntry | null,
    public readonly state: ReconciliationState = ReconciliationState.PENDING
  ) {}

  match(entry: JournalEntry): ReconciliationRecord {
    if (this.state !== ReconciliationState.PENDING) throw new Error('Can only match PENDING records');
    if (!this.statementLine.amount.equals(entry.amount)) {
      // Typically, reconciliation requires amounts to match exactly for auto-matching.
      // Directionality matters (Debits/Credits vs Bank +/-)
    }
    return new ReconciliationRecord(this.id, this.statementLine, entry, ReconciliationState.MATCHED);
  }

  manualMatch(entry: JournalEntry): ReconciliationRecord {
    return new ReconciliationRecord(this.id, this.statementLine, entry, ReconciliationState.MANUAL_MATCH);
  }

  ignore(): ReconciliationRecord {
    return new ReconciliationRecord(this.id, this.statementLine, null, ReconciliationState.IGNORED);
  }
}
