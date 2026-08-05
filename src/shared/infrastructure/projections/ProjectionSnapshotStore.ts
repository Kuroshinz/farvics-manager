import { ProjectionSnapshot } from '../../../modules/financial/projections/snapshots';

export interface ISnapshotPolicy {
  shouldSnapshot(eventCount: number, lastSnapshotAt: Date): boolean;
}

export interface ISnapshotStore {
  save<T>(snapshot: ProjectionSnapshot<T>): Promise<void>;
  getLatest<T>(projectionName: string): Promise<ProjectionSnapshot<T> | null>;
}

export class ProjectionSnapshotStore implements ISnapshotStore {
  async save<T>(snapshot: ProjectionSnapshot<T>): Promise<void> {}
  async getLatest<T>(projectionName: string): Promise<ProjectionSnapshot<T> | null> { return null; }
}
