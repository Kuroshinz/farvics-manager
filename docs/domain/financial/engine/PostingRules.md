# Posting Rules & Double Entry
Posting a journal transitions it from DRAFT to POSTED. 
The PostingEngine validates:
1. Double Entry (Debit == Credit).
2. Accounting Period constraints (Cannot post to closed periods).
3. Currency boundaries (Single currency journals only in base implementation).
