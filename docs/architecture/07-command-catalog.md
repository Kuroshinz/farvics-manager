# Farvics Manager - Command Catalog

## 1. `CreateTransactionCommand`
- **Validation**: Amount != 0, valid AccountId.
- **Handler**: `CreateTransactionUseCase`
- **Generates**: `TransactionCreated`

## 2. `TransferFundsCommand`
- **Validation**: Sufficient balance, matching currencies (or fx rate provided).
- **Generates**: `TransferCompleted`

