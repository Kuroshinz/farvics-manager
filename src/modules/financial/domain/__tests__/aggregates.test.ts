import { AccountFactory, JournalFactory } from '../factories';

describe('Financial Aggregates', () => {
  it('should initialize AccountAggregate correctly', () => {
    const account = AccountFactory.createNew();
    expect(account).toBeDefined();
    expect(account.version).toBe(0);
  });

  it('should initialize JournalAggregate correctly', () => {
    const journal = JournalFactory.createNew();
    expect(journal).toBeDefined();
    expect(journal.domainEvents.length).toBe(0);
  });
});
