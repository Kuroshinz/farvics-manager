export enum ProjectionState {
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  REBUILDING = 'REBUILDING',
  FAILED = 'FAILED'
}

export interface ProjectionCursor {
  readonly position: string | number;
  readonly timestamp: Date;
}

export interface ProjectionCheckpoint {
  readonly id: string;
  readonly projectionName: string;
  readonly cursor: ProjectionCursor;
  readonly lastUpdatedAt: Date;
}

export interface ProjectionVersion {
  readonly current: number;
  readonly expected?: number;
}

export interface ProjectionMetadata {
  readonly name: string;
  readonly version: ProjectionVersion;
  readonly state: ProjectionState;
  readonly tags: string[];
}

export interface ProjectionStatistics {
  readonly eventsProcessed: number;
  readonly lastProcessingLatencyMs: number;
  readonly totalRebuilds: number;
  readonly errorCount: number;
  readonly lag: number; // difference between stream head and cursor
}
