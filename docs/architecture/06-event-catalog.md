# AURA.MONEY - Event Catalog

## Universal Event Metadata
All events strictly require:
- `correlationId`: Tracks the entire user workflow.
- `causationId`: The ID of the event/command that triggered this.
- `hopCount`: Incremented per cascaded event (Max 5).

## 1. `TransactionCreated`
- **Aggregate**: `Transaction`
- **Payload**: `{ transactionId, accountId, amount, currency }`
