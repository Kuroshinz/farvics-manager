import { IProjection } from '../builders';
import { ProjectionCheckpoint, ProjectionMetadata, ProjectionStatistics } from '../metadata';

export interface ProjectionRepository<TState> {
  get(projectionName: string, id: string): Promise<IProjection<TState> | null>;
  save(id: string, projection: IProjection<TState>, checkpoint: ProjectionCheckpoint): Promise<void>;
  updateMetadata(name: string, metadata: ProjectionMetadata): Promise<void>;
  getStatistics(name: string): Promise<ProjectionStatistics>;
  getCheckpoint(name: string): Promise<ProjectionCheckpoint | null>;
}
