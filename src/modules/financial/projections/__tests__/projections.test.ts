import { ProjectionState } from '../metadata';

describe('CQRS Projections', () => {
  it('should represent projection state structurally', () => {
    expect(ProjectionState.RUNNING).toBe('RUNNING');
  });
});
