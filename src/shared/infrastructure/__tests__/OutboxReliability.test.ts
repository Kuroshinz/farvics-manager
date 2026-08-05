describe('Outbox Reliability & Failures', () => {
  it('prevents Version 2 processing before Version 1', () => {});
  it('detects Poison Messages directly to DLQ', () => {});
  it('strips locks on Lease Timeout automatically', () => {});
  it('blocks integration events when REPLAY mode is active', () => {});
  it('exposes Oldest Pending Event metrics correctly', () => {});
});
