import { IProjection } from '../builders';
import { ProjectionCheckpoint } from '../metadata';

export interface ProjectionConflictResolver<TState> {
  resolveConflict(localState: IProjection<TState>, remoteState: IProjection<TState>): IProjection<TState>;
}

export interface ProjectionRebuilder {
  rebuildAll(projectionName: string): Promise<void>;
  rebuildFromCheckpoint(projectionName: string, checkpoint: ProjectionCheckpoint): Promise<void>;
}

export interface ProjectionRepairService {
  detectAnomalies(projectionName: string): Promise<boolean>;
  repair(projectionName: string, targetId: string): Promise<void>;
}
