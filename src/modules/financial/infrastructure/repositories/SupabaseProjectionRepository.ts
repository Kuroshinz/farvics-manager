import { ProjectionRepository } from '../../projections/repositories';
import { IProjection } from '../../projections/builders';
import { ProjectionCheckpoint, ProjectionMetadata, ProjectionStatistics } from '../../projections/metadata';

export class SupabaseProjectionRepository<TState> implements ProjectionRepository<TState> {
  constructor(private readonly supabaseClient: any) {}

  async get(projectionName: string, id: string): Promise<IProjection<TState> | null> { return null; }
  async save(id: string, projection: IProjection<TState>, checkpoint: ProjectionCheckpoint): Promise<void> {}
  async updateMetadata(name: string, metadata: ProjectionMetadata): Promise<void> {}
  async getStatistics(name: string): Promise<ProjectionStatistics> { return {} as ProjectionStatistics; }
  async getCheckpoint(name: string): Promise<ProjectionCheckpoint | null> { return null; }
}
