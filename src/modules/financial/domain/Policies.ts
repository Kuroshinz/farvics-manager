import { Money } from './Money';
import { AccountNumber, TransactionNumber } from './Identifiers';
import { AccountingPeriod, BusinessDate } from './Calendar';
import { LedgerTransaction } from './Ledger';

export class FinancialInvariants {
  static ensureCurrencyConsistency(monies: Money[]): void {
    if (monies.length <= 1) return;
    const standard = monies[0].currency;
    for (const m of monies) {
      if (!m.currency.equals(standard)) {
        throw new Error('Currency consistency violation');
      }
    }
  }
}

export class DomainPolicies {
  static canTransfer(balance: Money, amount: Money): boolean {
    FinancialInvariants.ensureCurrencyConsistency([balance, amount]);
    return balance.isGreaterThan(amount) || balance.equals(amount);
  }

  static canDeleteTransaction(period: AccountingPeriod): boolean {
    return !period.isClosed;
  }

  static canArchiveAccount(balance: Money): boolean {
    return balance.isZero();
  }

  static canEditClosedPeriod(period: AccountingPeriod): boolean {
    // Closed periods are strictly immutable
    return !period.isClosed;
  }

  static canRestoreTransaction(transaction: LedgerTransaction, period: AccountingPeriod): boolean {
    return !period.isClosed;
  }
}
