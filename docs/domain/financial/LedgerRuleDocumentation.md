# Ledger Rule Documentation
The Ledger relies on double-entry accounting.
Every `LedgerTransaction` is bound to a `TransactionType` (Income, Expense, Transfer, Adjustment, Refund).
Transactions contain `LedgerEntry` items mapping to DEBIT or CREDIT.
The engine strictly verifies that the sum of entries balances to zero.
