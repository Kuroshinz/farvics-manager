# Code Review Checklist

- [ ] **Architecture**: Does this violate the Dependency Rule (e.g., UI importing DB drivers)?
- [ ] **DDD**: Are mutations occurring outside of Aggregate boundaries?
- [ ] **Security**: Is the user ID verified server-side on every mutation? Is RLS bypassed?
- [ ] **Testing**: Are edge cases covered? Are we mocking the DB correctly or using local integration tests?
- [ ] **Error Handling**: Are all exceptions mapped to standard `ErrorDTO` contracts?
- [ ] **Observability**: Are `correlationId` and `causationId` propagated correctly?
