import { ProjectionCheckpoint, ProjectionCursor } from '../../../modules/financial/projections/metadata';

export interface ICheckpointStore {
  getCheckpoint(projectionName: string): Promise<ProjectionCheckpoint | null>;
  saveCheckpoint(checkpoint: ProjectionCheckpoint): Promise<void>;
}

export class ProjectionCheckpointStore implements ICheckpointStore {
  async getCheckpoint(projectionName: string): Promise<ProjectionCheckpoint | null> {
    return null;
  }
  async saveCheckpoint(checkpoint: ProjectionCheckpoint): Promise<void> {}
}
