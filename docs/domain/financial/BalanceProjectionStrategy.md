# Balance Projection Strategy
Balances are **never** manually mutated. 
The `BalanceEngine` projects current balance state strictly from historical immutable `LedgerEntry` records.
ReadModels cache these calculations, but the source of truth remains the entry log.
