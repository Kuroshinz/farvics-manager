# Accounting Rules
- Transactions belong to a `BusinessDate` which maps to an `AccountingPeriod`.
- Once an `AccountingPeriod` is marked as `isClosed` by creating a `ClosingPeriod`, no transactions within its bounding dates can be modified, deleted, or introduced.
- Strict Domain Policies (`CanEditClosedPeriod`) guard these constraints.
