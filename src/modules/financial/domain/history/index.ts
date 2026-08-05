export interface ChangeSet {
  readonly version: number;
  readonly changes: any[];
  readonly timestamp: Date;
}

export interface EventHistory {
  readonly aggregateId: string;
  readonly events: any[];
}

export interface AuditTrail {
  readonly actor: string;
  readonly action: string;
  readonly timestamp: Date;
  readonly metadata: any;
}

export interface AggregateHistory {
  readonly aggregateId: string;
  readonly changesets: ChangeSet[];
  readonly auditTrails: AuditTrail[];
}
