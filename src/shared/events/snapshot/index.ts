export interface SnapshotVersion { readonly version: number; }
export interface SnapshotMetadata { readonly createdAt: Date; readonly sourceVersion: number; }
export interface SnapshotPolicy { shouldSnapshot(aggregateVersion: number): boolean; }
export interface SnapshotCompatibility { canRestore(snapshotVersion: SnapshotVersion, systemVersion: SnapshotVersion): boolean; }
export interface SnapshotResolver { resolveLatest(aggregateId: string): any; }
