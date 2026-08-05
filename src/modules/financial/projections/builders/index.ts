import { IDomainEvent } from '../../../../shared/core/Events';
import { ProjectionMetadata, ProjectionState } from '../metadata';

export interface ProjectionContext {
  readonly eventId: string;
  readonly correlationId: string;
  readonly causationId: string;
  readonly timestamp: Date;
}

export interface IProjection<TState> {
  readonly metadata: ProjectionMetadata;
  readonly state: TState;
  apply(event: IDomainEvent, context: ProjectionContext): void;
}

export interface ProjectionBuilder<TState> {
  build(events: IDomainEvent[], initialState?: TState): IProjection<TState>;
  applyEvent(projection: IProjection<TState>, event: IDomainEvent, context: ProjectionContext): IProjection<TState>;
}
