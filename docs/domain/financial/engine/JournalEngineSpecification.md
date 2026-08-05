# Journal Engine Specification
The core execution environment for transactions. The Journal Aggregate roots multiple JournalEntries.
It enforces the Double Entry principle (Total Debit == Total Credit) atomically upon instantiation.
States: DRAFT -> POSTED <-> REVERSED.
Historical records are immutable.
