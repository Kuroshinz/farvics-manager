import { ProjectionVersion, ProjectionCursor } from '../metadata';

export interface ProjectionSnapshot<TState> {
  readonly projectionName: string;
  readonly state: TState;
  readonly version: ProjectionVersion;
  readonly cursor: ProjectionCursor;
  readonly takenAt: Date;
}
